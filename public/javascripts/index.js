function selectProfile (e) {
  const { userId } = e.dataset
  document.location = `/profile?userId=${userId}`
}

document.querySelectorAll('.rows').forEach((e) => e.addEventListener('click', selectProfile.bind(null, e)))
