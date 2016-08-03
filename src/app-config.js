module.exports = (() => {
  const inboxFolder = 'sharkm';
  const outboxFolder = 'outbox';
  const archiveFolder = 'archive';
  const inboxPath = `${process.env.HOME}/${inboxFolder}`;
  const outboxPath = `${inboxPath}/${outboxFolder}`;
  const archivePath = `${outboxPath}/${archiveFolder}`;
  const tagCachePath = `${inboxPath}/tags`;
  
  return {
    inboxFolder,
    inboxPath,
    outboxPath,
    archivePath,
    tagCachePath
  };
})();