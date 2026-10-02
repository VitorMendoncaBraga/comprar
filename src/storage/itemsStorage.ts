import AsyncStorage from "@react-native-async-storage/async-storage";

import { FilterStatus } from "@/types/FilterStatus";

const ITEMS_STORAGE_KEY = '@comprar:items';

export type ItemStorage = {
    id: string,
    description: string,
    status: FilterStatus
}

async function get(): Promise<ItemStorage[]> {
    try {
        const storage = await AsyncStorage.getItem(ITEMS_STORAGE_KEY)
        return storage ? JSON.parse(storage) : []
    } catch (error) {
        throw Error("GET ITEMS: " + error)
    }
}

async function getByStatus(status: FilterStatus): Promise<ItemStorage[]> {
    try {
        const items = await get()
        const filteredItems = items.filter(item => item.status === status)
        return filteredItems
    } catch (error) {
        throw Error("GET BY STATUS: " + error)
    }
}

async function save(items: ItemStorage[]): Promise<void> {
    try {
        await AsyncStorage.setItem(ITEMS_STORAGE_KEY, JSON.stringify(items))
    } catch (error) {
        throw Error("SAVE: " + error)
    }
}

async function clear() : Promise<void> {
    await AsyncStorage.removeItem(ITEMS_STORAGE_KEY)
}

async function remove(id: string) : Promise<void> {
    const items = await get()
    const updatedItems = items.filter(item => item.id !== id)
    await save(updatedItems)
}

async function add(item: ItemStorage): Promise<void> {
    const items = await get();
    const updatedItems: ItemStorage[] = [...items, item]
    await save(updatedItems)
}

async function updateItemStatus(id: string) {
    const items = await get();
    const updatedItems : ItemStorage[] = items.map((item) => (
        item.id === id ? {
            ...item,
            status: item.status === FilterStatus.PENDING ? FilterStatus.DONE : FilterStatus.PENDING
        } : {
            ...item
        }
    ))
    await save(updatedItems)
}

export const itemsStorage = {
    get,
    getByStatus,
    add,
    remove,
    clear,
    updateItemStatus,
}