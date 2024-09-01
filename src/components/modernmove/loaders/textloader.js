import { useProgress, Html } from "@react-three/drei"

export default function TextLoader() {
    const { active, progress, errors, item, loaded, total } = useProgress()
    return <Html center>{progress} % loaded</Html>
}
