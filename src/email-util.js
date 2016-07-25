module.exports = (() => {
  function unreadInboxEmails() {
    return new Promise((resolve, reject) => {
      reject(Error('not implemented'));
    });
  }

  function pendingOutboxEmails(outboxPath) {
    return new Promise((resolve, reject) => {
      reject(Error('not implemented'));
    });
  }
  
  return {
    unreadInboxEmails,
    pendingOutboxEmails
  };
})();