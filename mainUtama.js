// Set
  const listProses = 'belum_dibaca';
  const listSelesai = 'sudah_dibaca';
  const submitAction = document.getElementById('inputBook');
  const masihDibacaCover = document.getElementById('incompleteBookshelfList');
  const selesaiDibacaCover = document.getElementById('completeBookshelfList');

  // cek dukungan storage
  function checkForStorage() {
    return typeof(Storage) != 'undefined';
  }

  // buat id
  function makeId(params) {
    if (params.length != 0) {
      const lastId = params.pop().id;
      return lastId+1;
    } else {
      return 1;
    }
  }

  // input
  function putList(data) {
    if (checkForStorage()) {
      
      if (data.selesai) {//buku s3elesai dibaca
        let dibaca= []
        if (localStorage.getItem(listSelesai) !== null) {
          dibaca = JSON.parse(localStorage.getItem(listSelesai));
        }
        dibaca.unshift(data);
          
        localStorage.setItem(listSelesai, JSON.stringify(dibaca));
      } else { // buku belum dibaca
          let belumSelesai = [];
          if (localStorage.getItem(listProses) !== null) {
            belumSelesai = JSON.parse(localStorage.getItem(listProses));
          }
          belumSelesai.unshift(data);
            
          localStorage.setItem(listProses, JSON.stringify(belumSelesai));
      }

    }
  }

  // ambil data buku yang belum selesai
  function getProses() {
    if (checkForStorage()) {
      return JSON.parse(localStorage.getItem(listProses)) || [];
    } else {
      return [];
    }
  }
  // ambil data buku yang sudah selesai
  function getSelesai() {
    if (checkForStorage()) {
      return JSON.parse(localStorage.getItem(listSelesai)) || [];
    } else {
      return [];
    }
  }

  // render data buku
  function renderList(masihDibaca, sudahDibaca) {
    let daftarDibaca = '<h2>Belum selesai dibaca</h2>';
    let selesaiDibaca = '<h2>Selesai dibaca</h2>';
    // buat dafar
    if (masihDibaca != undefined) {
      masihDibaca.forEach(element => {
        daftarDibaca += `
                <div class="book_item">
                  <h3>`+element.title+`</h3>
                  <p>Penulis: `+element.author+`</p>
                  <p>Tahun: `+element.year+`</p>
              
                  <div class="action">
                    <button class="green" onclick="jadikanSelesai(`+element.id+`)">Selesai dibaca</button>
                    <button class="red" onclick="hapus(getProses(), `+element.id+`, 'belum_dibaca')">Hapus buku</button>
                  </div>
                </div>`;
      });
    }

    if (sudahDibaca != undefined) {
      sudahDibaca.forEach(element => {
        selesaiDibaca += `
                <div class="book_item">
                  <h3>`+element.title+`</h3>
                  <p>Penulis: `+element.author+`</p>
                  <p>Tahun: `+element.year+`</p>
              
                  <div class="action">
                    <button class="green" onclick="jadikanBelumSelesai(`+element.id+`)">Belum dibaca</button>
                    <button class="red" onclick="hapus(getSelesai(), `+element.id+`, 'sudah_dibaca')">Hapus buku</button>
                  </div>
                </div>`;
      });
    }

    // render
    masihDibacaCover.innerHTML = daftarDibaca;
    selesaiDibacaCover.innerHTML = selesaiDibaca;
  }

  // hapus
  function hapus(err, id, text) {
    if (confirm("Yakin mau meghapus buku ini?")) {
      remove(err, id, text)
    }
    return;
  }
  function remove(arr, id, dataItem) {
    // find index
    const objWithIdIndex = arr.findIndex((obj) => obj.id === id);
    // delet data by index
    if (objWithIdIndex > -1) {
      arr.splice(objWithIdIndex, 1);
    }
    // simpan
    localStorage.setItem(dataItem, JSON.stringify(arr));
    // render
    renderList(getProses(), getSelesai())
  }

  // search
  function searching() {
    const kriteria = document.getElementById("searchBookTitle").value;
    const dibaca = getProses();
    const selesai = getSelesai();
    let hasilAkhirDibaca = [];
    let hasilAkhirSelesai = [];
    // checking buku yang belum selesai
    dibaca.forEach(element => {
      const title = element.title.toLowerCase();
      const hasil = title.search(kriteria.toLowerCase());

      if (hasil != -1) {
        hasilAkhirDibaca.unshift(element)
      }
    });
    // checking buku yang sudah selesai
    selesai.forEach(element => {
      const title = element.title.toLowerCase();
      const hasil = title.search(kriteria.toLowerCase());

      if (hasil != -1) {
        hasilAkhirSelesai.unshift(element)
      }
    });
    // render
    renderList(hasilAkhirDibaca, hasilAkhirSelesai)
  }

  // jadikan selesai dibaca
  function jadikanSelesai(id) {
    const allData = getProses();
    const neededData = allData.find(e => e.id === id);
    // ganti id-nya
    neededData.id = makeId(getSelesai());
    // ganti status-nya
    neededData.selesai = true;
    // masukkan ke kolom selesai
    putList(neededData);
    // hapus datanya dan render
    remove(getProses(), id, 'belum_dibaca');
  }

  // jadikan belum selesai dibaca
  function jadikanBelumSelesai(id) {
    const allData = getSelesai();
    const neededData = allData.find(e => e.id === id);
    // ganti id-nya
    neededData.id = makeId(getProses());
    // ganti status-nya
    neededData.selesai = false;
    // masukkan ke kolom selesai
    putList(neededData);
    // hapus datanya dan render
    remove(getSelesai(), id, 'sudah_dibaca');
  }

  // load halaman
  window.addEventListener('load', function () {
    // cek apakah ada dukungan fitur
    if (checkForStorage) { // jikka ada dukungan
      
      let proses;
      let selesai;

      if (localStorage.getItem(listProses) !== null) { // cek apakah data buku yg belum selesai sudah ada
        console.log('Ada bahan bacaan');
        // get data bukunya
        proses = getProses();
      } else {
        console.log('bahan bacaan kosong');
      }

      if (localStorage.getItem(listSelesai) !== null) { // cek apakah data buku yg sudah selesai ada
        console.log('ada buku yang selesai');
        // get data bukunya
        selesai = getSelesai();
      } else {
        console.log('Belum ada buku selesai');
      }

      // render data
      renderList(proses, selesai);

    } else { // jika tidakada dukungan
      alert('Browser yang Anda gunakan tidak mendukung Web Storage');
    }
  });

  // submit data
  submitAction.addEventListener('submit', function (event) {
    const inputBookTitle = document.getElementById('inputBookTitle').value;
    const inputBookAuthor = document.getElementById('inputBookAuthor').value;
    const inputBookYear = document.getElementById('inputBookYear').value;
    const inputBookIsComplete = document.getElementById('inputBookIsComplete').checked;
    let idData = '';
    if (inputBookIsComplete) {
      idData = makeId(getSelesai());
    } else {
      idData = makeId(getProses());
    }
    const newData = {
      title: inputBookTitle,
      author: inputBookAuthor,
      year: inputBookYear,
      selesai: inputBookIsComplete,
      id: idData,
    };
 
    putList(newData);
  });

// ===================================================
  // Get the modal
  var modal = document.getElementById("myModal");
  
  // Get the button that opens the modal
  var btn = document.getElementById("myBtn");
  
  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];
  
  // When the user clicks on the button, open the modal
  btn.onclick = function() {
    modal.style.display = "block";
  }
  
  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
    modal.style.display = "none";
  }
  
  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
// ========================================================== 
  