import { Audios, PartialAudios } from '@/types/vanko.type';
import { createClient } from '@/utils/supabase/server';
import { PostgrestError, PostgrestResponse } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest, { params }: { params: { mode: string } }) {
  const { mode } = params;
  const supabase = createClient();

  if (mode === 'add') {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const uploadResults: Audios[] = [];

    const { data: audioNumbers, error: audioNumbersError } = await supabase
      .from('audios')
      .select('number');

    if (audioNumbersError) {
      console.error('Error fetching audio numbers:', audioNumbersError.message);
      return NextResponse.json(audioNumbersError.message, { status: 500 });
    }

    for (const file of files) {
      const uniqueFileName = `${Date.now()}_${file.name}`;
      try {
        const { data, error } = await supabase.storage.from('audio').upload(uniqueFileName, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type,
        });

        if (error) {
          console.error(`Error uploading ${file.name}:`, error.message);
          // 업로드 실패한 파일에 대한 처리를 계속하려면 continue 사용
          continue;
        }

        const { data: url } = supabase.storage.from('audio').getPublicUrl(data.path);

        const newAudioData: PartialAudios = {
          title: file.name.replace(/[^\p{L}\s]/gu, ''), // 특수문자와 숫자 제거
          url: url.publicUrl,
          number: audioNumbers.length + 1,
        };

        const {
          data: audioData,
          error: audioError,
        }: { data: Audios | null; error: PostgrestError | null } = await supabase
          .from('audios')
          .insert({ ...newAudioData })
          .select()
          .single();

        if (audioError) {
          console.error(`Error inserting audio data:`, audioError.message);
          continue;
        }

        if (audioData) {
          uploadResults.push(audioData);
        }
      } catch (error) {
        console.error(`Exception uploading ${file.name}:`, error);
        // 예외 발생 시에도 다음 파일로 진행
        continue;
      }
    }

    return NextResponse.json(uploadResults, { status: 200 });
  } else {
    const audioData = await request.json();
    const { data, error }: { data: Audios[] | null; error: PostgrestError | null } = await supabase
      .from('audios')
      .update(audioData)
      .select();

    if (error) {
      console.error(`Error updating audio data:`, error.message);
      return NextResponse.json(error.message, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { mode: string } }) {
  const { mode } = params;
  const supabase = createClient();

  if (mode === 'delete') {
    const audioData = await request.json();
    const {
      data,
      error,
    }: {
      data: PostgrestResponse<{ status: number; statusText: string }> | null;
      error: PostgrestError | null;
    } = await supabase.from('audios').delete().eq('id', audioData.id);

    if (error) {
      console.error(`Error deleting audio data:`, error.message);
      return NextResponse.json(error.message, { status: 500 });
    }

    const {
      data: audios,
      error: audioError,
    }: { data: Audios[] | null; error: PostgrestError | null } = await supabase
      .from('audios')
      .select();

    if (audioError) {
      console.error(`Error deleting audio data:`, audioError.message);
      return NextResponse.json(audioError.message, { status: 500 });
    }

    const sortedAudios = audios?.sort((a, b) => (a.number as number) - (b.number as number));
    const reorderedAudios = sortedAudios?.map((audio, index) => ({
      ...audio,
      number: index + 1,
    }));

    const {
      data: finalData,
      error: finalError,
    }: { data: Audios[] | null; error: PostgrestError | null } = await supabase
      .from('audios')
      .update(reorderedAudios)
      .select();

    if (finalError) {
      console.error(`Error reordering audio data:`, finalError.message);
      return NextResponse.json(finalError.message, { status: 500 });
    }

    return NextResponse.json(finalData, { status: 200 });
  }
}
