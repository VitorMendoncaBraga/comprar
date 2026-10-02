import { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, Text, FlatList, Alert } from 'react-native';
import { styles } from '@/app/Home/styles'
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Filter } from '@/components/Filter';
import { FilterStatus } from '@/types/FilterStatus';
import { Item } from '@/components/Item';
import { itemsStorage, ItemStorage } from '@/storage/itemsStorage';
const FILTER_STATUS: FilterStatus[] = [FilterStatus.PENDING, FilterStatus.DONE]

export function Home() {
  const [filter, setFilter] = useState<FilterStatus>(FilterStatus.PENDING)
  const [description, setDescription] = useState("")
  const [items, setItems] = useState<ItemStorage[]>([])

  async function handleAdd() {
    if (!description.trim()) {
      return Alert.alert("Adicionar", "Informe a descrição para adicionar")
    }

    const newItem = {
      status: FilterStatus.PENDING,
      description,
      id: Math.random().toString(36).substring(2)
    }

    await itemsStorage.add(newItem)
    await getItemsByStatus()
    setFilter(FilterStatus.PENDING)

    setDescription("")
  }

  async function handleClear() {
    Alert.alert("Limpar", "Deseja remover todos?", [
      {
        text: "Não",
        style: "cancel"
      },
      {
        text: "Sim",
        onPress: async () => {
          await itemsStorage.clear()
          await setItems([])
        }
      }
    ])

  }

  async function handleRemove(id: string) {
    await itemsStorage.remove(id)
    await getItemsByStatus()
  }

  async function getItemsByStatus() {
    const items = await itemsStorage.getByStatus(filter)
    setItems(items)
  }

  async function handleStatus(id: string) {
    try {
      await itemsStorage.updateItemStatus(id)
      await getItemsByStatus()
    } catch (error) {
      
    }
  }

  useEffect(() => {
    getItemsByStatus()
  }, [filter])


  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require("@/app/Home/assets/logo.png")}></Image>

      <View style={styles.form}>
        <Input
          placeholder='O que você precisa comprar?'
          onChangeText={setDescription}
          value={description}
        ></Input>
        <Button title='Adicionar' onPress={handleAdd}></Button>
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          {
            FILTER_STATUS.map((status) => (
              <Filter
                onPress={() => setFilter(status)}
                key={status}
                status={status}
                isActive={status === filter} />
            ))
          }
          <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
            <Text style={styles.clearText}>Limpar</Text>
          </TouchableOpacity>
        </View>

        <FlatList data={items} keyExtractor={item => String(item.id)} renderItem={({ item }) => (
          <Item data={{ description: item.description, status: item.status, id: item.id }} onRemove={() => handleRemove(item.id)} onStatus={() => handleStatus(item.id)} />
        )} ItemSeparatorComponent={() => <View style={styles.separator} />} contentContainerStyle={styles.listContainer} ListEmptyComponent={() => <Text style={styles.empty}>Nenhum item aqui.</Text>} />


      </View>
    </View>
  );
}

