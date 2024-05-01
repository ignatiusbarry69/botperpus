const execute = (payload) => {
    const { response, context_map } = payload;
    // const intent = intents
    if(typeof context_map === 'object'){
      if('username' in context_map){
        console.log("ok username masuk");
      }
    }
    return payload
    // if (intent[0] === "find_buku") {
    //   return ""

    // } else {
    //   console.log("intent not found");
    //   return `Maaf ${user}, saya belum memahami pertanyaanmu, coba tanyakan hal lain`
    // }
  };
  
  module.exports = {
    execute
  };