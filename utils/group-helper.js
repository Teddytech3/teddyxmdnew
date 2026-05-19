async function isAdmin(sock, groupId, userJid) {
  try {
    const groupMeta = await sock.groupMetadata(groupId)
    const participant = groupMeta.participants.find(p => 
      p.id === userJid || p.id === `${userJid}@s.whatsapp.net` || p.id === userJid.replace('@s.whatsapp.net', '')
    )
    return participant?.admin === 'admin' || participant?.admin === 'superadmin'
  } catch (err) {
    console.error('isAdmin error:', err)
    return false
  }
}

async function isBotAdmin(sock, groupId) {
  try {
    const botNumber = sock.user.id.split(':')[0]
    return await isAdmin(sock, groupId, `${botNumber}@s.whatsapp.net`)
  } catch (err) {
    console.error('isBotAdmin error:', err)
    return false
  }
}

module.exports = { isAdmin, isBotAdmin }
