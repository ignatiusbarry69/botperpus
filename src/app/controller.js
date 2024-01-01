const execute = (payload, user) => {
    const { intents, entities, text, traits } = payload;
    const intent = intents

    if (intent[0] === "find_buku") {
      return ""

    } else {
      console.log("intent not found");
      return `Maaf ${user}, saya belum memahami pertanyaanmu, coba tanyakan hal lain`
    }
  };
  
  module.exports = {
    execute
  };