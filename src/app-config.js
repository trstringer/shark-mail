module.exports = (() => {
  const inboxFolder = 'sharkm';
  const inboxPath = `${process.env.HOME}/${inboxFolder}`;
  const tagCachePath = `${inboxPath}/tags`;
  
  return {
    inboxFolder,
    inboxPath,
    tagCachePath
  };
})();