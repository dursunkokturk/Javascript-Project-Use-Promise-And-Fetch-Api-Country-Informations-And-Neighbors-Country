document.querySelector("#btnSearch").addEventListener("click", () => {
    let text = document.querySelector("#txtSearch").value;

    // Arama Isleminden Once Komsu Ulke Bilgisi Gelmesi Gerekmediginden Dolayi
    // Id Attribute unda details Degeri Olan Element Gorunur Olmasina Gerek Yok
    document.querySelector("#details").style.opacity = 0;
    
    getCountry(text);
});

function getCountry(country) {

    // Sorgula Islemini Yapiyoruz
    fetch('https://restcountries.com/v3.1/name/' + country)

        // Islem Basarili Olursa 
        // Object Haline Getririlmis Olarak 
        // Verileri Aliyoruz
        .then((response) => {

            // Olusmasi Muhtelemek Hatalari Tek Basliga Almak Icin Ilk Olarak
            // response Degiskenine Gelen Degerin ok Ozelligi false Ise 
            if(!response.ok)

                // Olusabilecek Tum Hatalari Error Object Icine Alarak Genel Bir Cerceveye Aliyoruz
                // Aranilan Deger Bulunamadiginda Kullaniciya Verilecek Mesaj
                throw new Error("Not Found Country");
            return response.json()
        })

        // Gelen Object Icindeki Verilerin 
        .then((data) => {

            // Alt Verisini Aliyoruz
            renderCountry(data[0]);

            // Alt Verileri Degiskene Atama Yapiyoruz
            const countries = data[0].borders;

            // Alt Veriler Yok Ise
            if(!countries) 
                throw new Error("Not Found Neighbor Country");
        
            // Yazilan Ulkeye Komsu Olan Ulkelerin Bilgilerini Aliyoruz
            return fetch('https://restcountries.com/v3.1/alpha?codes=' + countries.toString());
        })

        // Alt Verileri Almak Icin Yapilan Fetch Isleminden Donen Degerleri
        // Object Olarak Aliyoruz
        .then(response => response.json())

        // Alt Verileri Ekrana Yazdiriyoruz
        .then((data) => {
            renderNeighbors(data);
        })
        .catch(err => {
            renderError(err);
        });
}

function renderCountry(data) {        
    document.querySelector("#country-details").innerHTML = "";
    document.querySelector("#neighbors").innerHTML = "";
   
    let html = `                   
            <div class="col-4">
                <img src="${data.flags.png}" alt="" class="img-fluid">
            </div>
            <div class="col-8">
                <h3 class="card-title">${data.name.common}</h3>
                <hr>
                <div class="row">
                    <div class="col-4">Population: </div>
                    <div class="col-8">${(data.population / 1000000).toFixed(1)} milyon</div>
                </div>
                <div class="row">
                    <div class="col-4">Official Language: </div>
                    <div class="col-8">${Object.values(data.languages)}</div>
                </div>
                <div class="row">
                    <div class="col-4">Capital: </div>
                    <div class="col-8">${data.capital[0]}</div>
                </div>
                <div class="row">
                    <div class="col-4">Currency: </div>
                    <div class="col-8">${Object.values(data.currencies)[0].name} (${Object.values(data.currencies)[0].symbol})</div>
                </div>
            </div>
    `;            

    // Arama Isleminden Sonra Komsu Ulke Bilgisi Gelmesi Gerekiyor Ise
    // Id Attribute unda details Degeri Olan Element Gorunur Hale Gelecek
    document.querySelector("#details").style.opacity = 1;

    document.querySelector("#country-details").innerHTML = html;       
}
 
function renderNeighbors(data) {
    console.log(data);
    let html = "";
    for(let country of data) {
        html += `
            <div class="col-2 mt-2">
                <div class="card">
                    <img src="${country.flags.png}" class="card-img-top">
                    <div class="card-body">
                        <h6 class="card-title">${country.name.common}</h6>
                    </div>
                </div>
            </div>
        `;
        
    }
    document.querySelector("#neighbors").innerHTML =  html;
}

function renderError(err) {
    const html = `
        <div class="alert alert-danger">
            ${err.message}
        </div>
    `;
    setTimeout(function() {
        document.querySelector("#errors").innerHTML = "";
    }, 3000);
    document.querySelector("#errors").innerHTML = html;
}