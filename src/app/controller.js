const axios = require('axios');
const { parseString } = require('xml2js');
const DB = require('../conf/knex');

const apiUrl = 'https://library.ukdw.ac.id/main/opac/index.php';

// function parseStringHourIntoLong(strHour){
//   const [hours, minutes] = strHour.split(":");
//   const date = new Date();
//   date.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
//   const customTimeInMillis = date.getTime();
//   const longCustomTime = BigInt(customTimeInMillis);
//   return longCustomTime
// }

function parseStringHourIntoLong(timeInput) {
  const [hours, minutes] = timeInput.split(':').map(Number);

  const currentDate = new Date();
  currentDate.setHours(hours, minutes, 0, 0);

  const timeInMillis = currentDate.getTime();

  return timeInMillis;
}

function parseLongIntoStringHour(dateLong) {
  const date = new Date(Number(dateLong));
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

function checkIsTimeAvailable(oldStart,oldEnd,newStart,newEnd){
  let newStartLong = parseStringHourIntoLong(newStart);
  let newEndLong = parseStringHourIntoLong(newEnd);
  if(newEndLong <= oldStart || newStartLong >= oldEnd){
    return true
  }else{
    return false
  }
}

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
    console.log("it actually goes here lol")
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
    
  }else if(action != undefined && action === 'minta_nim'){
    finalResponse = response.text;
  }else if(action != undefined && action === 'input_peminjaman'){
    if(context_map.nim){
      const mahasiswa = await DB('mahasiswa')
        .select(
          '*'
        ).where('nim',parseInt(context_map.nim))
      if(mahasiswa.length===0){
        finalResponse = "Reservasi gagal, pastikan kamu memasukkan identitas yang benar"
      }else{
        // let found = mahasiswa.find(student => student.nim === parseInt(context_map.nim))
        // console.log("nim: "+parseInt(context_map.nim))
        // console.log("typenya: "+(typeof parseInt(context_map.nim)))
        // console.log(found)
        const newData = {
          id_ruang: context_map.ruang,
          nim: context_map.nim,
          waktu_start: parseStringHourIntoLong(context_map.waktumulai),
          waktu_selesai: parseStringHourIntoLong(context_map.waktuselesai)
        };
        const insertedRows = await DB('peminjaman').insert(newData);
        console.log(insertedRows);
        finalResponse = "Reservasi ruang berhasil, silahkan datang ke perpustakaan pada waktu yang ditentukan, dan berikan NIM atau Nomor Pegawaimu kepada petugas yang berjaga"
      }
    }else{
      finalResponse = "error, context nim not found"
    }
    
  }else if(action != undefined && action === 'pinjam_ruang'){
    try{
      let currentDate = new Date();
      let yesterdayDate = new Date(currentDate);
      yesterdayDate.setDate(currentDate.getDate() - 1);
      let tommorowInMillis = yesterdayDate.getTime();
      let tommorow = BigInt(tommorowInMillis);
      let idRuang = context_map.ruang

      const products = await DB('peminjaman')
        .select(
          '*'
        ).where('id_ruang',idRuang).where('waktu_start', '>', tommorow)
      console.log(products)
      if(products.length===0){
        finalResponse = "Ruang "+context_map.ruang+" tersedia, kamu jadi pinjam untuk "+context_map.waktumulai+" - "+context_map.waktuselesai+"? Tolong konfirmasi dengan pesan 'Ya' atau 'Tidak', bila kamu tidak mengkonfirmasi peminjaman ini dengan respon 'Ya', proses peminjaman akan dibatalkan"
      }else{
        let foundOverlap = false;
        products.forEach(product => {
          if(!foundOverlap){
            let cek = checkIsTimeAvailable(product.waktu_start, product.waktu_selesai, context_map.waktumulai, context_map.waktuselesai);
            if (cek) {
              finalResponse = "Ruang "+context_map.ruang+" tersedia, kamu jadi pinjam untuk "+context_map.waktumulai+" - "+context_map.waktuselesai+"? Tolong konfirmasi dengan pesan 'Ya' atau 'Tidak', bila kamu tidak mengkonfirmasi peminjaman ini dengan respon 'Ya', proses peminjaman akan dibatalkan";
            } else {
              console.log(product);
              let startLong = product.waktu_start;
              let startStringHour = parseLongIntoStringHour(startLong);
              let endLong = product.waktu_selesai;
              let endStringHour = parseLongIntoStringHour(endLong);
              finalResponse = "Yah, ruang itu masih dipake buat jam " + startStringHour + " sampai " + endStringHour;
              foundOverlap = true
            }
          }
        });
      }
      // finalResponse = "Kamu mau minjem ruang "+context_map.ruang+" dari jam "+context_map.waktumulai+" sampai "+context_map.waktuselesai+" betul?";

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