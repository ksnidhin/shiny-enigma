export const getSavedIds = (): string[] => {
  if (typeof window === "undefined") return []
  try {
    const data = localStorage.getItem("rtc_saved")
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export const isSaved = (id: string): boolean => {
  const ids = getSavedIds()
  return ids.includes(id)
}

export const toggleSaved = (id: string): boolean => {
  if (typeof window === "undefined") return false
  const ids = getSavedIds()
  const index = ids.indexOf(id)
  let nowSaved = false
  if (index >= 0) {
    ids.splice(index, 1)
    nowSaved = false
  } else {
    ids.push(id)
    nowSaved = true
  }
  localStorage.setItem("rtc_saved", JSON.stringify(ids))
  window.dispatchEvent(new Event("rtc_saved_updated"))
  return nowSaved
}
