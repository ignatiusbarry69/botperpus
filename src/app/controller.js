const axios = require('axios');
const { parseString } = require('xml2js');

const apiUrl = 'https://library.ukdw.ac.id/main/opac/index.php';

function extractDetail(xmlData) {
  let extractedData = [];

  parseString(xmlData, (err, result) => {
    if (err) {
      extractedData.push("Wah, sayangnya buku dengan nomor itu lagi kosong/sudah tidak tersedia");
      return;
    }

    const items = result.modsCollection.mods;

    if(items){
      items.forEach(item=>{
        const title = item.titleInfo[0].title[0];
        const sublocation = item.location[0].holdingSimple[0].copyInformation[0].sublocation[0];
        extractedData.push("Buku "+title+" ini tersedia di "+sublocation)

      })
    }
    
  });

  return extractedData;
}





function extractIdAndTitleFromXml(xmlData) {
  let extractedData = [];

  parseString(xmlData, (err, result) => {
    if (err) {
      console.error('Error parsing XML:', err);
      return;
    }

    const mods = result.modsCollection.mods;
    mods.forEach(mod => {
      const id = mod.$.ID;
      const title = mod.titleInfo[0].title[0];
      extractedData.push(id+" || "+title);
    });
  });

  return extractedData;
}

const execute = async (payload) => {
  const { response, context_map, action } = payload;
  let finalResponse;
  const queryParamsDetail = {
    p:'show_detail',
    inXML: 'true',
    id: ''
  };

  const queryParams = {
    resultXML: 'true',
    title: '',
    search: 'search',
    author: '',
    subject: '',
    isbn: '',
    gmd: '0',
    colltype: '0',
    location: '0'
  };

  if(context_map.nourut){
    queryParamsDetail.id = context_map.nourut
  }

  if(context_map.noseri){
    queryParams.isbn = context_map.noseri
  }
  if (context_map.querybuku) {
    queryParams.title = context_map.querybuku;
  }
  if (context_map.jenisbuku) {
    queryParams.subject = context_map.jenisbuku;
  }
  if (context_map.pengarangbuku) {
    queryParams.author = context_map.pengarangbuku;
  }

  if (action != undefined && action === 'cari_buku') {
      try {
          // console.log(JSON.stringify(queryParams))
          const opac = await axios.get(apiUrl, { params: queryParams });
          const data = opac.data;
          // console.log("opac: "+data.)
          // finalResponse = response.text;
          if(data.length === 0){
            finalResponse = "Yahh, buku itu belum tersedia di perpus UKDW, pastikan juga kata kunci yang kamu berikan sudah benar"

          }else{
            const extractedData = await extractIdAndTitleFromXml(data);
            const filteredData = extractedData.slice(0, 5);
            const combinedData = filteredData.join('\n');
            finalResponse = response.text+"\n\n"+"===============================\n"+
                                                 "No.      ||Judul Buku     \n"+
                                                 "===============================\n"+
                                                 combinedData+"\n"+
                                                 "===============================";
          }
          

      } catch (error) {
          console.error('Error fetching data buku:', error);
          throw error;
      }
  }else if(action != undefined && action === 'cek_buku_by_num'){
    try{
      const opac = await axios.get(apiUrl, { params: queryParamsDetail });
      const data = opac.data;
      const extractedData = await extractDetail(data);
      console.log(extractedData)
      finalResponse = extractedData.slice(0,7).join('\n')+", untuk informasi selengkapnya kamu dapat mengunjungi https://library.ukdw.ac.id/main/opac/index.php?p=show_detail&id="+queryParamsDetail.id+"&keywords=";
    }catch(error){
      console.error('Error fetching data detail:', error);
      throw error;
    }
    
  }else {
      finalResponse = response.text;
      // console.log(finalResponse);
  }
  console.log("finalresp: "+finalResponse)
  return finalResponse;
};

  
  module.exports = {
    execute
  };