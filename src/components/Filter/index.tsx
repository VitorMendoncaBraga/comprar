import { styles } from "@/components/Filter/styles"
import { FilterStatus } from "@/types/FilterStatus"
import { TouchableOpacity, TouchableOpacityProps, Text } from "react-native"
import { CircleCheck } from "lucide-react-native"
import { StatusIcon } from "../StatusIcon"

type Props = TouchableOpacityProps & {
    status: FilterStatus,
    isActive: boolean,
    onPress: () => void
}

export function Filter({ status, isActive, onPress, ...rest }: Props) {
    return (
        <TouchableOpacity style={[styles.container, { opacity: isActive ? 1 : 0.5}]} activeOpacity={0.8} {...rest} onPress={onPress}>
            <StatusIcon status={status} />
            <Text style={styles.title}>{status === FilterStatus.DONE ? "Comprados" : "Pendentes"}</Text>
        </TouchableOpacity>
    )
}