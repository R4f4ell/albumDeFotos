import { supabase } from '../lib/supabase'

export const getInteraction = async (imageId) => {
  const { data, error } = await supabase
    .from('interactions')
    .select('likes, downloads')
    .eq('image_id', imageId)
    .maybeSingle() // ← trocado para maybeSingle()

  if (error) {
    console.error('Erro ao buscar interações:', error)
    return null
  }

  return data
}

export const incrementLike = async (imageId) => {
  const existing = await getInteraction(imageId)

  if (existing === null) {
    await supabase
      .from('interactions')
      .insert({ image_id: imageId, likes: 1 })
  } else {
    await supabase
      .from('interactions')
      .update({ likes: existing.likes + 1 })
      .eq('image_id', imageId)
  }
}

export const incrementDownload = async (imageId) => {
  const existing = await getInteraction(imageId)

  if (existing === null) {
    await supabase
      .from('interactions')
      .insert({ image_id: imageId, downloads: 1 })
  } else {
    await supabase
      .from('interactions')
      .update({ downloads: existing.downloads + 1 })
      .eq('image_id', imageId)
  }
}

export const getLikedImageIds = async () => {
  const { data, error } = await supabase
    .from('interactions')
    .select('image_id')
    .gt('likes', 0)

  if (error) {
    console.error('Erro ao buscar imagens curtidas:', error)
    return []
  }

  return data.map((row) => row.image_id)
}

export const getDownloadedImageIds = async () => {
  const { data, error } = await supabase
    .from('interactions')
    .select('image_id')
    .gt('downloads', 0)

  if (error) {
    console.error('Erro ao buscar imagens baixadas:', error)
    return []
  }

  return data.map((row) => row.image_id)
}