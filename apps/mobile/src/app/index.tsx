import React from 'react'
import { Button, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Constants from 'expo-constants'
import { Stack, useRouter } from 'expo-router'
import { FlashList } from '@shopify/flash-list'

import { api, type RouterOutputs } from '~/utils/api'

const PostCard: React.FC<{
  app: RouterOutputs['app']['all']['list'][number]
  onDelete: () => void
}> = ({ app, onDelete }) => {
  const router = useRouter()

  return (
    <View className='flex flex-row rounded-lg bg-white/10 p-4'>
      <View className='flex-grow'>
        <TouchableOpacity onPress={() => router.push(`/app/${app.id}`)}>
          <Text className='text-xl font-semibold text-pink-400'>
            {app.name}
          </Text>
          <Text className='mt-2 text-white'>{app.description}</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={onDelete}>
        <Text className='font-bold uppercase text-pink-400'>Delete</Text>
      </TouchableOpacity>
    </View>
  )
}

const CreatePost: React.FC = () => {
  const utils = api.useContext()

  const [name, setName] = React.useState('')
  const [description, setDescription] = React.useState('')

  const { mutate, error } = api.app.create.useMutation({
    async onSuccess() {
      setName('')
      setDescription('')
      await utils.app.all.invalidate()
    },
  })

  return (
    <View className='mt-4'>
      <TextInput
        className='mb-2 rounded bg-white/10 p-2 text-white'
        placeholderTextColor='rgba(255, 255, 255, 0.5)'
        value={name}
        onChangeText={setName}
        placeholder='Title'
      />
      {error?.data?.zodError?.fieldErrors.name && (
        <Text className='mb-2 text-red-500'>
          {error.data.zodError.fieldErrors.name}
        </Text>
      )}
      <TextInput
        className='mb-2 rounded bg-white/10 p-2 text-white'
        placeholderTextColor='rgba(255, 255, 255, 0.5)'
        value={description}
        onChangeText={setDescription}
        placeholder='Content'
      />
      {error?.data?.zodError?.fieldErrors.description && (
        <Text className='mb-2 text-red-500'>
          {error.data.zodError.fieldErrors.description}
        </Text>
      )}
      <TouchableOpacity
        className='rounded bg-pink-400 p-2'
        onPress={() => {
          mutate({
            name,
            description,
          })
        }}
      >
        <Text className='font-semibold text-white'>Publish post</Text>
      </TouchableOpacity>
    </View>
  )
}

const Index = () => {
  const utils = api.useContext()

  const postQuery = api.app.all.useQuery()

  const deletePostMutation = api.app.delete.useMutation({
    onSettled: () => utils.app.all.invalidate(),
  })

  const nextPublicClerkPublishableKey =
    (Constants?.expoConfig?.extra?.nextPublicClerkPublishableKey as string) ??
    ''

  return (
    <SafeAreaView className='bg-[#1F104A]'>
      {/* Changes page title visible on the header */}
      <Stack.Screen options={{ title: 'Home Page' }} />
      <View className='h-full w-full p-4'>
        <Text className='mx-auto pb-2 text-5xl font-bold text-white'>
          Create <Text className='text-pink-400'>T3</Text> Turbo
        </Text>

        <Button
          onPress={() => void utils.app.all.invalidate()}
          title='Refresh posts'
          color={'#f472b6'}
        />

        <View className='py-2'>
          <Text className='font-semibold italic text-white'>
            Press on a post
          </Text>
        </View>

        <FlashList
          data={postQuery.data}
          estimatedItemSize={20}
          ItemSeparatorComponent={() => <View className='h-2' />}
          renderItem={(app) => (
            <PostCard
              app={app.item}
              onDelete={() => deletePostMutation.mutate(app.item.id)}
            />
          )}
        />

        <CreatePost />
      </View>
    </SafeAreaView>
  )
}

export default Index
