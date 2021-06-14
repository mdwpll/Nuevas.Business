<template>
  <v-app class="main-background">
    <div v-if="authenticate">
      <v-app-bar app color="transparent" flat absolute>
        <v-spacer></v-spacer>
        <v-toolbar-title>
          Мониторинг перспективных мест размещения бизнеса
        </v-toolbar-title>
       
        <v-spacer></v-spacer>
        <v-btn
          icon
          color="black"
          v-on:click="(role = 'user'), (selectedBussines = 0)"
        >
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon dark v-bind="attrs" v-on="on"> mdi-magnify </v-icon>
            </template>
            <span>Детальный режим</span>
          </v-tooltip>
        </v-btn>
        <v-btn
          icon
          color="black"
          v-on:click="(role = 'boss'), (selectedBussines = 0)"
        >
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon dark v-bind="attrs" v-on="on"> mdi-map-search </v-icon>
            </template>
            <span>Обзорный режим</span>
          </v-tooltip>
        </v-btn>
        <v-btn icon color="black" v-on:click="logout">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon dark v-bind="attrs" v-on="on"> mdi-exit-to-app </v-icon>
            </template>
            <span>Выйти</span>
          </v-tooltip>
        </v-btn>
      </v-app-bar>
      <v-main>
        <v-container>
          <v-row class="mb-6" no-gutters>
            <!-- Выбор биснеса-->
            <v-col cols="2" class="pa-3">
              <v-sheet elevation="6" width="100%" height="50vh">
                <perfect-scrollbar>
                  <v-card-text class="headline font-weight-bold pb-0">
                    Вид бизнеса:
                  </v-card-text>
                  <v-list two-line>
                    <v-list-item-group
                      v-model="selectedBussines"
                      active-class="pink--text"
                    >
                      <template v-for="(item, index) in itemsBussines">
                        <v-list-item :key="item.name">
                          <v-list-item-content>
                            <v-list-item-title
                              v-text="item.name"
                            ></v-list-item-title>
                            <v-list-item-subtitle
                              class="text--primary"
                              v-if="index != 0"
                            >
                            </v-list-item-subtitle>
                          </v-list-item-content>
                        </v-list-item>

                        <v-divider
                          :key="index"
                        ></v-divider>
                      </template>
                    </v-list-item-group>
                  </v-list>
                </perfect-scrollbar>
              </v-sheet>
            </v-col>
            <!-- Выбор профайла-->
            <v-col cols="2" class="pa-3">
              <v-sheet elevation="6" width="100%" height="50vh">
                <perfect-scrollbar>
                  <v-card-text class="headline font-weight-bold pb-0">
                    Профайл ЦА:
                  </v-card-text>
                  <v-list two-line>
                    <v-list-item-group
                      v-model="selectedProff"
                      active-class="pink--text"
                    >
                      <template v-for="(item, index) in itemsProff">
                        <v-list-item :key="item.name">
                          <v-list-item-content>
                            <v-list-item-title
                              v-text="item.name"
                            ></v-list-item-title>
                            <v-list-item-subtitle
                              class="text--primary"
                              v-if="index != 0"
                            >
                            </v-list-item-subtitle>
                          </v-list-item-content>
                        </v-list-item>

                        <v-divider
                          :key="index"
                        ></v-divider>
                      </template>
                    </v-list-item-group>
                  </v-list>
                </perfect-scrollbar>
              </v-sheet>
            </v-col>

            <!-- Выбор объекта-->
            <v-col cols="8" class="pa-3" v-if="role === 'user'">
              <v-sheet elevation="6" height="50vh" width="100%">
                <perfect-scrollbar height="550px">
                  <v-card
                    class="mx-auto"
                    elevation="0"
                    color="transparent"
                    max-width="1550"
                  >
                    <v-card-text class="headline font-weight-bold pb-0">
                      Выбор объекта 
                    </v-card-text>
                  </v-card>
                  <v-card
                    class="mx-auto"
                    elevation="0"
                    color="transparent"
                    max-width="1550"
                    v-for="item in Sheet0"
                    :key="item.global_id"
                  >
                    <div
                     v-if="itemsProff[selectedProff].name === item.CA && selectedBussines === item.Bussines"
                    >
                      <v-card-text class="subtitle-1 py-1">
                        Адрес: {{ item.Address }}
                        <br />
                        <span>{{ item.WebSite }}</span>
                        <br />
                        <span>Площадь: {{ item.Space }}</span>
                        <br />
                        <span>Стоимость: {{ item.StartPrice }}</span>
                        <br />
                        <span>Средний чек: {{ item.srCh }}</span>
                        <br />
                        <span>{{ item.geoData }}</span>
                        <v-divider />
                      </v-card-text>
                    </div>
                  </v-card>
                </perfect-scrollbar>
              </v-sheet>
            </v-col>
            
            <!-- Карта -->
            <v-col cols="8" class="pa-3" v-if="role === 'boss'">
              <v-sheet elevation="8" height="50vh" width="100%">
                <perfect-scrollbar height="550px">
                  <l-map
                    :zoom="zoom"
                    :center="center"
                    :options="mapOptions"
                    class="rounded-xl"
                  >
                    <l-tile-layer :url="urlMap" :attribution="attributionMap" />
                   <!-- Точки -->
                    <div v-for="item in Sheet1" :key="item.id">
                      <div
                         v-if="itemsProff[selectedProff].name === item.CA && selectedBussines === item.Bussines"
                      >
                        <l-marker :lat-lng="item.location">
                          <l-popup>
                            <span class="subtitle-1 mr-2">
                              Потенциальные клиенты в час: {{ item.Capacity }}</span
                            >
                            <span class="subtitle-1 mr-2">
                              Время препровождение в точке: {{ item.geoarea }}</span
                            >
                          </l-popup>
                        </l-marker>
                      </div>
                    </div> 
                  </l-map>
                </perfect-scrollbar>
              </v-sheet>
            </v-col>


            <!-- Относительные значения -->
          </v-row>
          <v-row>
            <v-col cols="2" class="pa-3">
              <v-sheet elevation="6" width="100%">
                <v-card
                  class="mx-auto"
                  elevation="0"
                  color="transparent"
                  max-width="550"
                >
                  <v-card-text class="headline font-weight-bold pb-0">
                    Управление визуализацией
                  </v-card-text>
                </v-card>
                <v-radio-group v-model="period" mandatory>
                  <v-radio label="День" value="day"></v-radio>
                  <v-radio label="Неделя" value="week"></v-radio>
                  <v-radio label="Месяц" value="month"></v-radio>
                </v-radio-group>
                <v-radio-group
                  v-model="seriesThree"
                  mandatory
                  v-if="period === 'month'"
                >
                  <v-radio
                    label=""
                    :value="ontSmiSocMonth"
                  ></v-radio>
                  <v-radio
                    label=""
                    :value="positiveNegativeMonth"
                  ></v-radio>
                </v-radio-group>
                <v-radio-group
                  v-model="seriesThree"
                  mandatory
                  v-if="period === 'week'"
                >
                  <v-radio
                    label=""
                    :value="ontSmiSocWeek"
                  ></v-radio>
                  <v-radio
                    label=""
                    :value="positiveNegativeWeek"
                  ></v-radio>
                </v-radio-group>
                <v-radio-group
                  v-model="seriesThree"
                  mandatory
                >
                  <v-radio
                    label="Метрика"
                    :value="ontSmiSocDay"
                  ></v-radio>
                </v-radio-group>
              </v-sheet>
            </v-col>
            <!-- График большой -->
            <v-col cols="10" class="pa-3">
              <v-sheet
                elevation="6"
                height="100%"
                width="100%"
                v-if="!sameSize"
              >
                <apexchart
                  width="100%"
                  height="100%"
                  type="area"
                  :options="chartOptionsDay"
                  :series="seriesThree"
                ></apexchart>
              </v-sheet>
              <v-sheet elevation="6" height="100%" width="100%" v-if="sameSize">
                <apexchart
                  width="100%"
                  height="100%"
                  type="area"
                  :options="chartOptionsDaySameSize"
                  :series="seriesThree"
                ></apexchart>
              </v-sheet>
            </v-col>
          </v-row>

        </v-container>
      </v-main>
    </div>
    <div v-else>
      <v-container fluid fill-height class="loginOverlay">
        <v-layout flex align-center justify-center>
          <v-flex xs12 sm4 elevation-6>
            <v-toolbar class="pt-5 blue darken-4">
              <v-toolbar-title class="white--text"
                ><h4>Nuevas</h4></v-toolbar-title
              >
            </v-toolbar>
            <v-card>
              <v-card-text class="pt-4">
                <div>
                  <v-form v-model="valid" ref="form">
                    <v-text-field
                      label="E-mail"
                      v-model="email"
                      :rules="emailRules"
                      required
                    ></v-text-field>
                    <v-text-field
                      label="Пароль"
                      v-model="password"
                      min="8"
                      type="password"
                      :rules="passwordRules"
                      counter
                      required
                    ></v-text-field>
                    <v-layout justify-space-between>
                      <v-btn
                        @click="submit"
                        :class="{
                          'blue darken-4 white--text': valid,
                          disabled: !valid,
                        }"
                        >Войти</v-btn
                      >
                    </v-layout>
                  </v-form>
                </div>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </div>
  </v-app>
</template>

<style>
.main-background {
  background: #000000;
}
.card-backgroud {
  background: #000000;
}
.scroll {
  overflow-y: scroll;
}
.ps {
  height: 50vh;
}
</style>

<script>
Array.prototype.random = function () {
  return this[Math.floor(Math.random() * this.length)];
};
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

import { latLng } from "leaflet";
import Rainbow from "rainbowvis.js";
var rainbow = new Rainbow();
rainbow.setNumberRange(0, 100);
rainbow.setSpectrum("red", "yellow", "green");

export default {
  name: "MainApp",

  seriesThree: function (val) {
      
        this.sameSize = false;
    },

  mounted() {
    this.$refs.map.mapObject.setView([500, 500], 1);
  },

  mounted: function () {
    // this.messages = shuffle(this.messages);
    this.ontSmiSocWeekMO = this.ontSmiSocWeek;
    this.authenticate = localStorage.authenticate;
  },
  //методы сортировки
  methods: {
    getColor: function (num) {
      if (num === 0) {
        return "#000000";
      } else {
        var hex = rainbow.colourAt(num);
        var color = "#" + hex;
        return color;
      }
    },

    submit() {
      if (this.$refs.form.validate()) {
        this.$refs.form.$el.submit();
        if (
          (this.email === "mo@nuevas.tech" && this.password === "password") 
        ) {
          localStorage.authenticate = true;
          this.authenticate = true;
        }
      }
    },
    logout() {
      localStorage.authenticate = false;
      this.authenticate = false;
    },
  },

  data: () => ({
    seriesThree: [],
    authenticate: true,
    valid: false,
    e1: false,
    // данные карты
    zoom: 12,
    center: latLng(55.751667, 37.617778),
    urlMap: "http://a.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png",
    attributionMap:
      '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    mapOptions: {
      zoomSnap: 0.5,
    },
    // - данные карты

    selectedBussines: 0,
    selectedProff: 0,

    password: "",
    passwordRules: [(v) => !!v || "Введите пароль"],
    email: "",
    emailRules: [
      (v) => !!v || "Введите E-mail",
      (v) =>
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,5})+$/.test(v) ||
        "E-mail не верен",
    ],
    sameSize: false,
    role: "user",

    itemsBussines: [
      {
        name: "Фуд ритейл",
      },
      {
        name: "Парикмахерские, салоны красоты и т.п.",
      },
      {
        name: "Рестораны, кафе, бары и ночные клубы",
      },
      {
        name: "Бытовая химия, магазины косметики и т.п.",
      },
      {
        name: "Клиники, стоматологии, вет.клиники",
      },
      {
        name: "Услуги (кофе на вынос, ремонт обуви и ювелирных изделий) и мелкая торговля(фото, пресса, мороженое)",
      },
    ],

    itemsProff: [
      {
        name: "14-18",
      },
      {
        name: "19-24",
      },
      {
        name: "25-34",
      },
      {
        name: "35-44",
      },
      {
        name: "45-64",
      },
      {
        name: "65+",
      },
       {
        name: "Женский",
      },
      {
        name: "Мужской",
      },
      {
        name: "Работает",
      },
      {
        name: "Учится",
      },
    ],

    Sheet0:  [
        {
            Address: "город Москва, 1-й Щемиловский переулок, дом 19, строение 1",
            global_id: "969493618",
            Space: "375",
            StartPrice: "48430000",
            WebSite: "investmoscow.ru//tenders/tendercard/?tenderId=17331380",
            geoData: "coordinates=[37.6062939175633, 55.7794172714021]",
            srCh: "517.00",
            CA: "14-18",
            Bussines: 0
        },
        {
            Address: "город Москва, Староконюшенный переулок, дом 43",
            global_id: "858621197",
            Space: "165.9",
            StartPrice: "12350000",
            WebSite: "investmoscow.ru//tenders/tendercard/?tenderId=17142712",
            geoData: "coordinates=[37.5942944232248, 55.7495350726314]",
            srCh: "873.00",
            CA: "14-18",
            Bussines: 0
        },
        {
            Address: "город Москва, Воротниковский переулок, дом 8, строение 1",
            global_id: "1006671762",
            Space: "153.1",
            StartPrice: "11270000",
            WebSite: "investmoscow.ru//tenders/tendercard/?tenderId=17341260",
            geoData: "coordinates=[37.6019879022607, 55.7703034045171]",
            srCh: "995.00",
            CA: "14-18",
            Bussines: 1
        },
        {
            Address: "город Москва, 2-я Дубровская улица, дом 5",
            global_id: "858623548",
            Space: "86.7",
            StartPrice: "14540000",
            WebSite: "investmoscow.ru//tenders/tendercard/?tenderId=17139771",
            geoData: "coordinates=[37.67163607, 55.72805353]",
            srCh: "3017.00",
            CA: "14-18",
            Bussines: 1
        },
        {
            Address: "город Москва, 1-я улица Машиностроения, дом 10",
            global_id: "841761029",
            Space: "91.1",
            StartPrice: "18050000",
            WebSite: "investmoscow.ru//tenders/tendercard/?tenderId=17105147",
            geoData: "coordinates=[37.67145639, 55.71395621]",
            srCh: "2434.00",
            CA: "14-18",
            Bussines: 2
        },
        {
            Address: "город Москва, Сеченовский переулок, дом 5",
            global_id: "889926102",
            Space: "59.6",
            StartPrice: "7807000",
            WebSite: "investmoscow.ru//tenders/tendercard/?tenderId=17205008",
            geoData: "coordinates=[37.5959408241808, 55.7408100880514]",
            srCh: "964.00",
            CA: "14-18",
            Bussines: 2
        },
        {
            Address: "город Москва, 1-я улица Машиностроения, дом 10",
            global_id: "841761072",
            Space: "93.7",
            StartPrice: "18010000",
            WebSite: "investmoscow.ru/tenders/tendercard/?tenderId=17105169",
            geoData: "coordinates=[37.67145639, 55.71395621]",
            srCh: "2738.00",
            CA: "14-18",
            Bussines: 3
        },
        {
            Address: "город Москва, Гагаринский переулок, дом 28",
            global_id: "841766601",
            Space: "73.6",
            StartPrice: "10000000",
            WebSite: "investmoscow.ru/tenders/tendercard/?tenderId=17128423",
            geoData: "coordinates=[37.58932273, 55.74522123]",
            srCh: "3183.00",
            CA: "14-18",
            Bussines: 4
        },
        {
            Address: "город Москва, Новорогожская улица, дом 8",
            global_id: "841769394",
            Space: "17.3",
            StartPrice: "1049000",
            WebSite: "investmoscow.ru//tenders/tendercard/?tenderId=17131001",
            geoData: "coordinates=[37.68388399, 55.74111395]",
            srCh: "1904.00",
            CA: "14-18",
            Bussines: 5
        },
        {
            Address: "город Москва, 1-я улица Машиностроения, дом 10",
            global_id: "841761075",
            Space: "89.9",
            StartPrice: "17810000",
            WebSite: "investmoscow.ru//tenders/tendercard/?tenderId=17105178",
            geoData: "coordinates=[37.67145639, 55.71395621]",
            srCh: "3416.00",
            CA: "19-24",
            Bussines: 0
        },
        {
            Address: "город Москва, 3-й Крутицкий переулок, дом 15",
            global_id: "909468739",
            Space: "172.5",
            StartPrice: "12050000",
            WebSite: "investmoscow.ru//tenders/tendercard/?tenderId=17232167",
            geoData: "coordinates=[37.6618479049189, 55.7303979879729]",
            srCh: "682.00",
            CA: "19-24",
            Bussines: 0
        },
        {
            Address: "город Москва, Большой Саввинский переулок, дом 3",
            global_id: "841765008",
            Space: "152.1",
            StartPrice: "16960000",
            WebSite: "investmoscow.ru/tenders/tendercard/?tenderId=17122355",
            geoData: "coordinates=[37.57008119, 55.73559072]",
            srCh: "1764.00",
            CA: "19-24",
            Bussines: 1
        },
        {
            Address: "город Москва, Даниловская набережная, дом 6, корпус 1",
            global_id: "933937559",
            Space: "31.6",
            StartPrice: "6112000",
            WebSite: "investmoscow.ru//tenders/tendercard/?tenderId=17291353",
            geoData: "coordinates=[37.6408198242467, 55.7082314697429]",
            srCh: "863.00",
            CA: "19-24",
            Bussines: 1
        },
        {
            Address: "город Москва, Большая Серпуховская улица, дом 44",
            global_id: "841769580",
            Space: "129.9",
            StartPrice: "11531904",
            WebSite: "investmoscow.ru//tenders/tendercard/?tenderId=17131016",
            geoData: "coordinates=[37.62652028, 55.72282976]",
            srCh: "1980.00",
            CA: "19-24",
            Bussines: 2
        },
        {
            Address: "город Москва, 2-й Казачий переулок, дом 9",
            global_id: "933937819",
            Space: "96.4",
            StartPrice: "13900000",
            WebSite: "investmoscow.ru//tenders/tendercard/?tenderId=17293002",
            geoData: "coordinates=[37.6219225501929, 55.7333610151476]",
            srCh: "555.00",
            CA: "19-24",
            Bussines: 2
        },
        {
            Address: "город Москва, Пятницкая улица, дом 14, строение 13",
            global_id: "969613278",
            Space: "1012.4",
            StartPrice: "1416119728",
            WebSite: "investmoscow.ru//tenders/tendercard/?tenderId=17335185",
            geoData: "coordinates=[37.6270373053852, 55.7427683344825]",
            srCh: "815.00",
            CA: "19-24",
            Bussines: 3
        },
        {
            Address: "город Москва, 1-я улица Машиностроения, дом 4, корпус 2",
            global_id: "858621200",
            Space: "134.6",
            StartPrice: "5344000",
            WebSite: "investmoscow.ru//tenders/tendercard/?tenderId=17150004",
            geoData: "coordinates=[37.6698078825881, 55.7124671734153]",
            srCh: "2931.00",
            CA: "19-24",
            Bussines: 3
        },
        {
            Address: "город Москва, 2-й Зачатьевский переулок, дом 11",
            global_id: "841760279",
            Space: "16.4",
            StartPrice: "2141000",
            WebSite: "investmoscow.ru/tenders/tendercard/?tenderId=17107374",
            geoData: "coordinates=[37.60139761, 55.73998599]",
            srCh: "2249.00",
            CA: "19-24",
            Bussines: 4
        },
        {
            Address: "город Москва, Люсиновская улица, дом 39, строение 2",
            global_id: "893765705",
            Space: "24.9",
            StartPrice: "2595000",
            WebSite: "investmoscow.ru//tenders/tendercard/?tenderId=17210009",
            geoData: "coordinates=[37.6235710868648, 55.7225871485606]",
            srCh: "955.00",
            CA: "19-24",
            Bussines: 4
        },
        {
            Address: "город Москва, 1-я улица Машиностроения, дом 10",
            global_id: "841761033",
            Space: "93.7",
            StartPrice: "18010000",
            WebSite: "investmoscow.ru//tenders/tendercard/?tenderId=17105153",
            geoData: "coordinates=[37.67145639, 55.71395621]",
            srCh: "2455.00",
            CA: "19-24",
            Bussines: 5
        },
        {
            Address: "город Москва, Малый Лёвшинский переулок, дом 14/9, строение 2",
            global_id: "897863768",
            Space: "15.8",
            StartPrice: "1252000",
            WebSite: "investmoscow.ru//tenders/tendercard/?tenderId=17219205",
            geoData: "coordinates=[37.5904884977219, 55.7423727579842]",
            srCh: "583.00",
            CA: "19-24",
            Bussines: 5
        },
        {
            Address: "город Москва, 1-я улица Машиностроения, дом 10",
            global_id: "841761038",
            Space: "89.9",
            StartPrice: "17810000",
            WebSite: "investmoscow.ru//tenders/tendercard/?tenderId=17105163",
            geoData: "coordinates=[37.67145639, 55.71395621]",
            srCh: "2881.00",
            CA: "25-34",
            Bussines: 0
        },
        {
            Address: "город Москва, проезд Шломина, дом 6",
            global_id: "870354405",
            Space: "37.3",
            StartPrice: "1720000",
            WebSite: "investmoscow.ru//tenders/tendercard/?tenderId=17183738",
            geoData: "coordinates=[37.5814108176357, 55.749642770395]",
            srCh: "1363.00",
            CA: "25-34",
            Bussines: 1
        },
        {
            Address: "город Москва, Нижегородская улица, дом 25",
            global_id: "879037800",
            Space: "1069.8",
            StartPrice: "35721949",
            WebSite: "investmoscow.ru//tenders/tendercard/?tenderId=17186073",
            geoData: "coordinates=[37.6938620617416, 55.7374197341913]",
            srCh: "1118.00",
            CA: "25-34",
            Bussines: 2
        },
        {
            Address: "город Москва, 2-й Казачий переулок, дом 9",
            global_id: "933937820",
            Space: "167.8",
            StartPrice: "27910000",
            WebSite: "investmoscow.ru//tenders/tendercard/?tenderId=17293016",
            geoData: "coordinates=[37.6219225501929, 55.7333610151476]",
            srCh: "749.00",
            CA: "25-34",
            Bussines: 3
        },
        {
            Address: "город Москва, Ленинский проспект, дом 23",
            global_id: "886107084",
            Space: "16.3",
            StartPrice: "1750000",
            WebSite: "investmoscow.ru//tenders/tendercard/?tenderId=17199783",
            geoData: "coordinates=[37.5963610170073, 55.7173374732385]",
            srCh: "3115.00",
            CA: "25-34",
            Bussines: 3
        },
        {
            Address: "город Москва, Большая Калитниковская улица, дом 42А",
            global_id: "936953043",
            Space: "10.8",
            StartPrice: "1399200",
            WebSite: "investmoscow.ru//tenders/tendercard/?tenderId=17282498",
            geoData: "coordinates=[37.6876386622525, 55.7363351779307]",
            srCh: "663.00",
            CA: "25-34",
            Bussines: 4
        },
        {
            Address: "город Москва, Люсиновская улица, дом 39, строение 2",
            global_id: "893765706",
            Space: "22.6",
            StartPrice: "2355000",
            WebSite: "investmoscow.ru//tenders/tendercard/?tenderId=17210117",
            geoData: "coordinates=[37.6235710868648, 55.7225871485606]",
            srCh: "764.00",
            CA: "25-34",
            Bussines: 4
        },
        {
            Address: "город Москва, 2-й Зачатьевский переулок, дом 11",
            global_id: "841760281",
            Space: "14.9",
            StartPrice: "2047000",
            WebSite: "investmoscow.ru/tenders/tendercard/?tenderId=17107290",
            geoData: "coordinates=[37.60139761, 55.73998599]",
            srCh: "3292.00",
            CA: "25-34",
            Bussines: 5
        },
        {
            Address: "город Москва, 2-й Казачий переулок, дом 9",
            global_id: "905410611",
            Space: "96.4",
            StartPrice: "13900000",
            WebSite: "investmoscow.ru//tenders/tendercard/?tenderId=17228887",
            geoData: "coordinates=[37.6219225501929, 55.7333610151476]",
            srCh: "673.00",
            CA: "25-34",
            Bussines: 5
        },
        {
            Address: "город Москва, 5-й Монетчиковский переулок, дом 20, строение 3",
            global_id: "933937739",
            Space: "163.4",
            StartPrice: "20000000",
            WebSite: "investmoscow.ru//tenders/tendercard/?tenderId=17296047",
            geoData: "coordinates=[37.6300144776993, 55.7324354452703]",
            srCh: "646.00",
            CA: "35-44",
            Bussines: 0
        },
        {
            Address: "город Москва, Нижегородская улица, дом 12",
            global_id: "886093161",
            Space: "34.7",
            StartPrice: "6856000",
            WebSite: "investmoscow.ru//tenders/tendercard/?tenderId=17199986",
            geoData: "coordinates=[37.6811045876597, 55.737675381783]",
            srCh: "540.00",
            CA: "35-44",
            Bussines: 0
        },
        {
            Address: "город Москва, Международная улица, дом 23",
            global_id: "937063995",
            Space: "14.4",
            StartPrice: "335000",
            WebSite: "investmoscow.ru//tenders/tendercard/?tenderId=17304012",
            geoData: "coordinates=[37.6902647507862, 55.7426734846238]",
            srCh: "904.00",
            CA: "35-44",
            Bussines: 1
        },
        {
            Address: "город Москва, 2-й Казачий переулок, дом 9",
            global_id: "905928903",
            Space: "9.5",
            StartPrice: "1163000",
            WebSite: "investmoscow.ru//tenders/tendercard/?tenderId=17229685",
            geoData: "coordinates=[37.6219225501929, 55.7333610151476]",
            srCh: "629.00",
            CA: "35-44",
            Bussines: 1
        },
        {
            Address: "город Москва, Большая Татарская улица, дом 44",
            global_id: "937879736",
            Space: "57.1",
            StartPrice: "9220000",
            WebSite: "investmoscow.ru//tenders/tendercard/?tenderId=17332249",
            geoData: "coordinates=[37.6352381627293, 55.7368144908548]",
            srCh: "799.00",
            CA: "35-44",
            Bussines: 2
        },
        {
            Address: "город Москва, Садовническая улица, дом 80",
            global_id: "909156608",
            Space: "77",
            StartPrice: "25338450",
            WebSite: "investmoscow.ru//tenders/tendercard/?tenderId=17230313",
            geoData: "coordinates=[37.6411810272523, 55.7375869109783]",
            srCh: "693.00",
            CA: "35-44",
            Bussines: 2
        },
        {
            Address: "город Москва, 2-й Зачатьевский переулок, дом 11",
            global_id: "841760283",
            Space: "12.6",
            StartPrice: "1777000",
            WebSite: "investmoscow.ru/tenders/tendercard/?tenderId=17107316",
            geoData: "coordinates=[37.60139761, 55.73998599]",
            srCh: "1906.00",
            CA: "35-44",
            Bussines: 3
        },
        {
            Address: "город Москва, Пятницкая улица, дом 73",
            global_id: "911788549",
            Space: "691.6",
            StartPrice: "13053966102",
            WebSite: "investmoscow.ru//tenders/tendercard/?tenderId=17237488",
            geoData: "coordinates=[37.6260349417122, 55.7305688369602]",
            srCh: "562.00",
            CA: "35-44",
            Bussines: 3
        },
        {
            Address: "город Москва, 1-я улица Машиностроения, дом 10",
            global_id: "841761042",
            Space: "48.6",
            StartPrice: "9502000",
            WebSite: "investmoscow.ru//tenders/tendercard/?tenderId=17105184",
            geoData: "coordinates=[37.67145639, 55.71395621]",
            srCh: "991.00",
            CA: "35-44",
            Bussines: 4
        },
        {
            Address: "город Москва, 1-я улица Машиностроения, дом 10",
            global_id: "841761083",
            Space: "89.9",
            StartPrice: "17810000",
            WebSite: "investmoscow.ru/tenders/tendercard/?tenderId=17105179",
            geoData: "coordinates=[37.67145639, 55.71395621]",
            srCh: "1944.00",
            CA: "35-44",
            Bussines: 5
        },
        {
            Address: "город Москва, 1-я улица Машиностроения, дом 10",
            global_id: "841761046",
            Space: "47.7",
            StartPrice: "9326000",
            WebSite: "investmoscow.ru//tenders/tendercard/?tenderId=17105209",
            geoData: "coordinates=[37.67145639, 55.71395621]",
            srCh: "1059.00",
            CA: "45-64",
            Bussines: 0
        },
        {
            Address: "город Москва, 2-й Казачий переулок, дом 9",
            global_id: "905930582",
            Space: "167.8",
            StartPrice: "27910000",
            WebSite: "investmoscow.ru//tenders/tendercard/?tenderId=17229832",
            geoData: "coordinates=[37.6219225501929, 55.7333610151476]",
            srCh: "934.00",
            CA: "45-64",
            Bussines: 0
        },
        {
            Address: "город Москва, 1-я улица Машиностроения, дом 10",
            global_id: "841761087",
            Space: "94.5",
            StartPrice: "18160000",
            WebSite: "investmoscow.ru//tenders/tendercard/?tenderId=17105137",
            geoData: "coordinates=[37.6714563851537, 55.7139562070125]",
            srCh: "2713.00",
            CA: "45-64",
            Bussines: 1
        },
        {
            Address: "город Москва, 1-я улица Машиностроения, дом 4, корпус 2",
            global_id: "906332802",
            Space: "199.1",
            StartPrice: "11570000",
            WebSite: "investmoscow.ru//tenders/tendercard/?tenderId=17229927",
            geoData: "coordinates=[37.6698078825881, 55.7124671734153]",
            srCh: "917.00",
            CA: "45-64",
            Bussines: 1
        },
        {
            Address: "город Москва, Даниловская набережная, дом 6А",
            global_id: "858627864",
            Space: "64.4",
            StartPrice: "8578000",
            WebSite: "investmoscow.ru//tenders/tendercard/?tenderId=17130937",
            geoData: "coordinates=[37.63830925, 55.70880299]",
            srCh: "1371.00",
            CA: "45-64",
            Bussines: 2
        },
        {
            Address: "город Москва, Большой Симоновский переулок, дом 2",
            global_id: "909156609",
            Space: "60.3",
            StartPrice: "10000000",
            WebSite: "investmoscow.ru//tenders/tendercard/?tenderId=17230285",
            geoData: "coordinates=[37.6727889213545, 55.7282164349086]",
            srCh: "849.00",
            CA: "45-64",
            Bussines: 2
        },
        {
            Address: "город Москва, Новокузнецкая улица, дом 34, строение 3",
            global_id: "865136530",
            Space: "91",
            StartPrice: "4733000",
            WebSite: "investmoscow.ru//tenders/tendercard/?tenderId=17177804",
            geoData: "coordinates=[37.6333843337316, 55.7332568795043]",
            srCh: "912.00",
            CA: "45-64",
            Bussines: 3
        },
        {
            Address: "город Москва, Саввинская набережная, дом 19, строение 1А",
            global_id: "933936567",
            Space: "202.7",
            StartPrice: "12940000",
            WebSite: "investmoscow.ru//tenders/tendercard/?tenderId=17257447",
            geoData: "coordinates=[37.5645735073905, 55.7339512012528]",
            srCh: "802.00",
            CA: "45-64",
            Bussines: 3
        },
        {
            Address: "город Москва, Международная улица, дом 23",
            global_id: "937063996",
            Space: "14.3",
            StartPrice: "333000",
            WebSite: "investmoscow.ru//tenders/tendercard/?tenderId=17304049",
            geoData: "coordinates=[37.6902647507862, 55.7426734846238]",
            srCh: "870.00",
            CA: "45-64",
            Bussines: 4
        },
        {
            Address: "город Москва, Малый Знаменский переулок, дом 7/10, строение 2",
            global_id: "880862712",
            Space: "34.4",
            StartPrice: "4400000",
            WebSite: "investmoscow.ru//tenders/tendercard/?tenderId=17190795",
            geoData: "coordinates=[37.6049773661071, 55.7482788812341]",
            srCh: "2854.00",
            CA: "45-64",
            Bussines: 4
        },
        {
            Address: "город Москва, 2-й Зачатьевский переулок, дом 11",
            global_id: "841760285",
            Space: "12.6",
            StartPrice: "1777000",
            WebSite: "investmoscow.ru/tenders/tendercard/?tenderId=17107341",
            geoData: "coordinates=[37.60139761, 55.73998599]",
            srCh: "3087.00",
            CA: "45-64",
            Bussines: 5
        },
        {
            Address: "город Москва, Народная улица, дом 8",
            global_id: "895788976",
            Space: "209.4",
            StartPrice: "10000000",
            WebSite: "investmoscow.ru//tenders/tendercard/?tenderId=17215161",
            geoData: "coordinates=[37.6511730508946, 55.7386927056296]",
            srCh: "924.00",
            CA: "45-64",
            Bussines: 5
        },
        {
            Address: "город Москва, Большой Симоновский переулок, дом 2",
            global_id: "841765744",
            Space: "119.4",
            StartPrice: "18640000",
            WebSite: "investmoscow.ru/tenders/tendercard/?tenderId=17128303",
            geoData: "coordinates=[37.67278892, 55.72821644]",
            srCh: "1966.00",
            CA: "65+",
            Bussines: 0
        },
        {
            Address: "город Москва, Городская улица, дом 5",
            global_id: "858622414",
            Space: "210",
            StartPrice: "9706000",
            WebSite: "investmoscow.ru//tenders/tendercard/?tenderId=17150765",
            geoData: "coordinates=[37.6179190943982, 55.7157270767774]",
            srCh: "2974.00",
            CA: "65+",
            Bussines: 1
        },
        {
            Address: "город Москва, Жуков проезд, дом 19",
            global_id: "894913668",
            Space: "961.8",
            StartPrice: "64380000",
            WebSite: "investmoscow.ru//tenders/tendercard/?tenderId=17211497",
            geoData: "coordinates=[37.6414645539219, 55.7228144355479]",
            srCh: "973.00",
            CA: "65+",
            Bussines: 2
        },
        {
            Address: "город Москва, Люсиновская улица, дом 31, строение 6",
            global_id: "969570619",
            Space: "569.2",
            StartPrice: "48140000",
            WebSite: "investmoscow.ru//tenders/tendercard/?tenderId=17316658",
            geoData: "coordinates=[37.6227710205463, 55.7239095500471]",
            srCh: "738.00",
            CA: "65+",
            Bussines: 3
        },
        {
            Address: "город Москва, 1-я улица Машиностроения, дом 10",
            global_id: "841761050",
            Space: "49.1",
            StartPrice: "9600000",
            WebSite: "investmoscow.ru//tenders/tendercard/?tenderId=17105210",
            geoData: "coordinates=[37.67145639, 55.71395621]",
            srCh: "2186.00",
            CA: "65+",
            Bussines: 4
        },
        {
            Address: "город Москва, Новорогожская улица, дом 27",
            global_id: "841754976",
            Space: "9339",
            StartPrice: "1000000",
            WebSite: "investmoscow.ru/tenders/tendercard/?tenderId=17047033",
            geoData: "coordinates=[37.69441682, 55.73851762]",
            srCh: "516.00",
            CA: "65+",
            Bussines: 4
        },
        {
            Address: "город Москва, 1-я улица Машиностроения, дом 10",
            global_id: "841763521",
            Space: "48.5",
            StartPrice: "9483000",
            WebSite: "investmoscow.ru/tenders/tendercard/?tenderId=17110548",
            geoData: "coordinates=[37.67145639, 55.71395621]",
            srCh: "865.00",
            CA: "65+",
            Bussines: 5
        },
        {
            Address: "город Москва, Пуговишников переулок, дом 4",
            global_id: "858625430",
            Space: "36.6",
            StartPrice: "11780000",
            WebSite: "investmoscow.ru//tenders/tendercard/?tenderId=17142471",
            geoData: "coordinates=[37.58669561, 55.73292343]",
            srCh: "2071.00",
            CA: "65+",
            Bussines: 5
        },
        {
            Address: "город Москва, 1-я улица Машиностроения, дом 10",
            global_id: "841761059",
            Space: "46.9",
            StartPrice: "9170000",
            WebSite: "investmoscow.ru//tenders/tendercard/?tenderId=17105223",
            geoData: "coordinates=[37.67145639, 55.71395621]",
            srCh: "2415.00",
            CA: "Женский",
            Bussines: 0
        },
        {
            Address: "город Москва, Денежный переулок, дом 8-10",
            global_id: "858627919",
            Space: "58.1",
            StartPrice: "7320000",
            WebSite: "investmoscow.ru//tenders/tendercard/?tenderId=17130126",
            geoData: "coordinates=[37.58820961, 55.74326684]",
            srCh: "1663.00",
            CA: "Женский",
            Bussines: 0
        },
        {
            Address: "город Москва, 2-я Дубровская улица, дом 5",
            global_id: "858623469",
            Space: "119.6",
            StartPrice: "19350000",
            WebSite: "investmoscow.ru//tenders/tendercard/?tenderId=17139755",
            geoData: "coordinates=[37.6716360663395, 55.7280535279879]",
            srCh: "2198.00",
            CA: "Женский",
            Bussines: 1
        },
        {
            Address: "город Москва, Нижегородская улица, дом 11А",
            global_id: "841764033",
            Space: "13.9",
            StartPrice: "1792300",
            WebSite: "investmoscow.ru/tenders/tendercard/?tenderId=17114242",
            geoData: "coordinates=[37.68554957, 55.73895007]",
            srCh: "2211.00",
            CA: "Женский",
            Bussines: 1
        },
        {
            Address: "город Москва, Большая Калитниковская улица, дом 42А",
            global_id: "858625152",
            Space: "57",
            StartPrice: "11360000",
            WebSite: "investmoscow.ru//tenders/tendercard/?tenderId=17139815",
            geoData: "coordinates=[37.68750543, 55.7364436]",
            srCh: "2765.00",
            CA: "Женский",
            Bussines: 2
        },
        {
            Address: "город Москва, Нижегородская улица, дом 25",
            global_id: "841761018",
            Space: "1069.8",
            StartPrice: "35721949",
            WebSite: "investmoscow.ru//tenders/tendercard/?tenderId=17093909",
            geoData: "coordinates=[37.69419024, 55.73739385]",
            srCh: "2588.00",
            CA: "Женский",
            Bussines: 2
        },
        {
            Address: "город Москва, Большой Симоновский переулок, дом 2",
            global_id: "863474142",
            Space: "53.5",
            StartPrice: "9905000",
            WebSite: "investmoscow.ru//tenders/tendercard/?tenderId=17173189",
            geoData: "coordinates=[37.6727889213545, 55.7282164349086]",
            srCh: "2324.00",
            CA: "Женский",
            Bussines: 3
        },
        {
            Address: "город Москва, Смоленская набережная, дом 5/13",
            global_id: "909313514",
            Space: "64.3",
            StartPrice: "7286000",
            WebSite: "investmoscow.ru//tenders/tendercard/?tenderId=17229806",
            geoData: "coordinates=[37.5767137957814, 55.7491790903765]",
            srCh: "989.00",
            CA: "Женский",
            Bussines: 3
        },
        {
            Address: "город Москва, Воронцовская улица, дом 25, строение 3",
            global_id: "841758810",
            Space: "25.9",
            StartPrice: "1591000",
            WebSite: "investmoscow.ru//tenders/tendercard/?tenderId=17093918",
            geoData: "coordinates=[37.6612837552758, 55.7361215329625]",
            srCh: "1810.00",
            CA: "Женский",
            Bussines: 4
        },
        {
            Address: "город Москва, Сосинская улица, дом 6",
            global_id: "909156887",
            Space: "250.3",
            StartPrice: "39080000",
            WebSite: "investmoscow.ru//tenders/tendercard/?tenderId=17230778",
            geoData: "coordinates=[37.6731900531485, 55.7293480119896]",
            srCh: "561.00",
            CA: "Женский",
            Bussines: 4
        },
        {
            Address: "город Москва, Воронцовская улица, дом 25, строение 3",
            global_id: "879037789",
            Space: "25.9",
            StartPrice: "1591000",
            WebSite: "investmoscow.ru//tenders/tendercard/?tenderId=17185987",
            geoData: "coordinates=[37.6612837552758, 55.7361215329625]",
            srCh: "1046.00",
            CA: "Женский",
            Bussines: 5
        },
        {
            Address: "город Москва, Студенческая улица, дом 26",
            global_id: "895134875",
            Space: "367.7",
            StartPrice: "20000000",
            WebSite: "investmoscow.ru//tenders/tendercard/?tenderId=17214114",
            geoData: "coordinates=[37.5462996023061, 55.7425303829494]",
            srCh: "515.00",
            CA: "Женский",
            Bussines: 5
        },
        {
            Address: "город Москва, 1-я улица Машиностроения, дом 10",
            global_id: "841761054",
            Space: "47.9",
            StartPrice: "9366000",
            WebSite: "investmoscow.ru//tenders/tendercard/?tenderId=17105218",
            geoData: "coordinates=[37.67145639, 55.71395621]",
            srCh: "554.00",
            CA: "Мужской",
            Bussines: 0
        },
        {
            Address: "город Москва, Котельническая набережная, дом 25, корпус 2",
            global_id: "894825800",
            Space: "607.1",
            StartPrice: "47870000",
            WebSite: "investmoscow.ru//tenders/tendercard/?tenderId=17212017",
            geoData: "coordinates=[37.6460137730061, 55.7429469954965]",
            srCh: "870.00",
            CA: "Мужской",
            Bussines: 0
        },
        {
            Address: "город Москва, 1-я улица Машиностроения, дом 10",
            global_id: "858625759",
            Space: "48.3",
            StartPrice: "9474000",
            WebSite: "investmoscow.ru//tenders/tendercard/?tenderId=17139748",
            geoData: "coordinates=[37.67145639, 55.71395621]",
            srCh: "1735.00",
            CA: "Мужской",
            Bussines: 1
        },
        {
            Address: "город Москва, Лаврушинский переулок, дом 17, строение 4",
            global_id: "841766686",
            Space: "18.1",
            StartPrice: "2203000",
            WebSite: "investmoscow.ru//tenders/tendercard/?tenderId=17130925",
            geoData: "coordinates=[37.62223681, 55.74141065]",
            srCh: "1189.00",
            CA: "Мужской",
            Bussines: 1
        },
        {
            Address: "город Москва, 1-я улица Машиностроения, дом 4, корпус 2",
            global_id: "895134872",
            Space: "134.6",
            StartPrice: "5344000",
            WebSite: "investmoscow.ru//tenders/tendercard/?tenderId=17214089",
            geoData: "coordinates=[37.6698078825881, 55.7124671734153]",
            srCh: "575.00",
            CA: "Мужской",
            Bussines: 2
        },
        {
            Address: "город Москва, Люсиновская улица, дом 39, строение 5",
            global_id: "841763552",
            Space: "677.9",
            StartPrice: "32129456",
            WebSite: "investmoscow.ru//tenders/tendercard/?tenderId=17121594",
            geoData: "coordinates=[37.6227400422224, 55.722479947503]",
            srCh: "2705.00",
            CA: "Мужской",
            Bussines: 2
        },
        {
            Address: "город Москва, Большая Калитниковская улица, дом 42А",
            global_id: "858625101",
            Space: "59.6",
            StartPrice: "10000000",
            WebSite: "investmoscow.ru//tenders/tendercard/?tenderId=17139798",
            geoData: "coordinates=[37.68750543, 55.7364436]",
            srCh: "645.00",
            CA: "Мужской",
            Bussines: 3
        },
        {
            Address: "город Москва, Международная улица, дом 23",
            global_id: "937063998",
            Space: "14.6",
            StartPrice: "337000",
            WebSite: "investmoscow.ru//tenders/tendercard/?tenderId=17304079",
            geoData: "coordinates=[37.6902647507862, 55.7426734846238]",
            srCh: "999.00",
            CA: "Мужской",
            Bussines: 3
        },
        {
            Address: "город Москва, Воротниковский переулок, дом 8, строение 1",
            global_id: "918232321",
            Space: "153.1",
            StartPrice: "11270000",
            WebSite: "investmoscow.ru//tenders/tendercard/?tenderId=17248397",
            geoData: "coordinates=[37.6019879022607, 55.7703034045171]",
            srCh: "698.00",
            CA: "Мужской",
            Bussines: 4
        },
        {
            Address: "город Москва, Новоостаповская улица, дом 4, корпус 1",
            global_id: "858623468",
            Space: "29.2",
            StartPrice: "1749000",
            WebSite: "investmoscow.ru//tenders/tendercard/?tenderId=17140069",
            geoData: "coordinates=[37.66607395, 55.71811866]",
            srCh: "1964.00",
            CA: "Мужской",
            Bussines: 4
        },
        {
            Address: "город Москва, Восточная улица, дом 7",
            global_id: "911788552",
            Space: "94.1",
            StartPrice: "4923600",
            WebSite: "investmoscow.ru//tenders/tendercard/?tenderId=17237702",
            geoData: "coordinates=[37.6601012019475, 55.7147121982952]",
            srCh: "672.00",
            CA: "Мужской",
            Bussines: 5
        },
        {
            Address: "город Москва, 1-я улица Машиностроения, дом 4, корпус 2",
            global_id: "858629216",
            Space: "199.1",
            StartPrice: "11570000",
            WebSite: "investmoscow.ru//tenders/tendercard/?tenderId=17143574",
            geoData: "coordinates=[37.6698078825881, 55.7124671734153]",
            srCh: "2891.00",
            CA: "Работает",
            Bussines: 0
        },
        {
            Address: "город Москва, Кутузовский проспект, дом 11",
            global_id: "933937991",
            Space: "178.9",
            StartPrice: "32760000",
            WebSite: "investmoscow.ru//tenders/tendercard/?tenderId=17292882",
            geoData: "coordinates=[37.5606623490775, 55.7476900196446]",
            srCh: "935.00",
            CA: "Работает",
            Bussines: 0
        },
        {
            Address: "город Москва, 2-я Дубровская улица, дом 5",
            global_id: "858623520",
            Space: "88.9",
            StartPrice: "131210000",
            WebSite: "investmoscow.ru//tenders/tendercard/?tenderId=17139759",
            geoData: "coordinates=[37.67163607, 55.72805353]",
            srCh: "3267.00",
            CA: "Работает",
            Bussines: 1
        },
        {
            Address: "город Москва, Люсиновская улица, дом 55",
            global_id: "886309000",
            Space: "50.8",
            StartPrice: "2170000",
            WebSite: "investmoscow.ru//tenders/tendercard/?tenderId=17201886",
            geoData: "coordinates=[37.6235973867005, 55.7171586937247]",
            srCh: "3101.00",
            CA: "Работает",
            Bussines: 1
        },
        {
            Address: "город Москва, 2-я Дубровская улица, дом 5",
            global_id: "909156593",
            Space: "119.6",
            StartPrice: "19643463",
            WebSite: "investmoscow.ru//tenders/tendercard/?tenderId=17230791",
            geoData: "coordinates=[37.6716360663395, 55.7280535279879]",
            srCh: "880.00",
            CA: "Работает",
            Bussines: 2
        },
        {
            Address: "город Москва, Нижегородская улица, дом 10, корпус 2",
            global_id: "937057520",
            Space: "172.2",
            StartPrice: "21470000",
            WebSite: "investmoscow.ru//tenders/tendercard/?tenderId=17329435",
            geoData: "coordinates=[37.6798497955773, 55.7376842657896]",
            srCh: "893.00",
            CA: "Работает",
            Bussines: 2
        },
        {
            Address: "город Москва, 5-й Монетчиковский переулок, дом 13",
            global_id: "861510593",
            Space: "34.9",
            StartPrice: "7131000",
            WebSite: "investmoscow.ru//tenders/tendercard/?tenderId=17165950",
            geoData: "coordinates=[37.6301147933893, 55.7318289449971]",
            srCh: "820.00",
            CA: "Работает",
            Bussines: 3
        },
        {
            Address: "город Москва, Нижегородская улица, дом 11",
            global_id: "858627920",
            Space: "1779.6",
            StartPrice: "96530000",
            WebSite: "investmoscow.ru//tenders/tendercard/?tenderId=17130161",
            geoData: "coordinates=[37.68549959, 55.73810277]",
            srCh: "642.00",
            CA: "Работает",
            Bussines: 3
        },
        {
            Address: "город Москва, Большая Серпуховская улица, дом 40, строение 2",
            global_id: "841755944",
            Space: "19.5",
            StartPrice: "1931000",
            WebSite: "investmoscow.ru/tenders/tendercard/?tenderId=17074865",
            geoData: "coordinates=[37.62546697, 55.72328855]",
            srCh: "3394.00",
            CA: "Работает",
            Bussines: 4
        },
        {
            Address: "город Москва, Студенческая улица, дом 32, строение 2",
            global_id: "858621087",
            Space: "593.4",
            StartPrice: "33188981",
            WebSite: "investmoscow.ru//tenders/tendercard/?tenderId=17137919",
            geoData: "coordinates=[37.5444883, 55.74134214]",
            srCh: "3211.00",
            CA: "Работает",
            Bussines: 4
        },
        {
            Address: "город Москва, 1-я улица Машиностроения, дом 10",
            global_id: "841761063",
            Space: "48.3",
            StartPrice: "9444000",
            WebSite: "investmoscow.ru//tenders/tendercard/?tenderId=17105226",
            geoData: "coordinates=[37.67145639, 55.71395621]",
            srCh: "2181.00",
            CA: "Работает",
            Bussines: 5
        },
        {
            Address: "город Москва, Большой Симоновский переулок, дом 2",
            global_id: "909156613",
            Space: "130.3",
            StartPrice: "21870000",
            WebSite: "investmoscow.ru//tenders/tendercard/?tenderId=17230306",
            geoData: "coordinates=[37.6727889213545, 55.7282164349086]",
            srCh: "643.00",
            CA: "Работает",
            Bussines: 5
        },
        {
            Address: "город Москва, Большая Серпуховская улица, дом 40, строение 2",
            global_id: "841755730",
            Space: "15.3",
            StartPrice: "1698000",
            WebSite: "investmoscow.ru/tenders/tendercard/?tenderId=17072840",
            geoData: "coordinates=[37.62546697, 55.72328855]",
            srCh: "951.00",
            CA: "Учится",
            Bussines: 0
        },
        {
            Address: "город Москва, Садовническая улица, дом 18",
            global_id: "881191327",
            Space: "90.8",
            StartPrice: "5074000",
            WebSite: "investmoscow.ru//tenders/tendercard/?tenderId=17188653",
            geoData: "coordinates=[37.6298784459697, 55.7470145426313]",
            srCh: "1645.00",
            CA: "Учится",
            Bussines: 0
        },
        {
            Address: "город Москва, Денежный переулок, дом 8-10",
            global_id: "906205306",
            Space: "58.1",
            StartPrice: "7320000",
            WebSite: "investmoscow.ru//tenders/tendercard/?tenderId=17229251",
            geoData: "coordinates=[37.588209605527, 55.7432668408087]",
            srCh: "898.00",
            CA: "Учится",
            Bussines: 1
        },
        {
            Address: "город Москва, Дербеневская набережная, дом 13/17, корпус 3",
            global_id: "937027233",
            Space: "41.9",
            StartPrice: "5672000",
            WebSite: "investmoscow.ru//tenders/tendercard/?tenderId=17328750",
            geoData: "coordinates=[37.6517939528456, 55.720401056255]",
            srCh: "656.00",
            CA: "Учится",
            Bussines: 2
        },
        {
            Address: "город Москва, Международная улица, дом 23",
            global_id: "937064001",
            Space: "14.1",
            StartPrice: "331000",
            WebSite: "investmoscow.ru//tenders/tendercard/?tenderId=17304242",
            geoData: "coordinates=[37.6902647507862, 55.7426734846238]",
            srCh: "950.00",
            CA: "Учится",
            Bussines: 3
        },
        {
            Address: "город Москва, Оболенский переулок, дом 9, корпус 3",
            global_id: "933937304",
            Space: "260.7",
            StartPrice: "3.8203E7",
            WebSite: "investmoscow.ru//tenders/tendercard/?tenderId=17272316",
            geoData: "coordinates=[37.5811794556056, 55.7316209601635]",
            srCh: "841.00",
            CA: "Учится",
            Bussines: 4
        },
        {
            Address: "город Москва, 2-я Дубровская улица, дом 5",
            global_id: "858623547",
            Space: "119.9",
            StartPrice: "19400000",
            WebSite: "investmoscow.ru//tenders/tendercard/?tenderId=17139762",
            geoData: "coordinates=[37.6716360663395, 55.7280535279879]",
            srCh: "3159.00",
            CA: "Учится",
            Bussines: 5
        },
        {
            Address: "город Москва, переулок Сивцев Вражек, дом 33",
            global_id: "909480616",
            Space: "14",
            StartPrice: "1103000",
            WebSite: "investmoscow.ru//tenders/tendercard/?tenderId=17232054",
            geoData: "coordinates=[37.5897752682954, 55.7468727229798]",
            srCh: "717.00",
            CA: "Учится",
            Bussines: "5"
        }
    ],
    
    
    Sheet1: [
        {
            id: 0,
            Capacity: "10",
            geoarea: "0.296581564",
            location: [55.710560,37.611924],
            Bussines: 0,
            CA: "14-18"
        },
        {
            id: 1,
            Capacity: "4",
            geoarea: "0.176206123",
            location: [55.7511211,37.5953675],
            Bussines: 4,
            CA: "14-18"
        },
        {
            id: 2,
            Capacity: "1",
            geoarea: "0.371565386",
            location: [55.752419,37.5971259],
            Bussines: 2,
            CA: "14-18"
        },
        {
            id: 3,
            Capacity: "2",
            geoarea: "0.217503756",
            location: [55.7391049,37.6417429],
            Bussines: 0,
            CA: "14-18"
        },
        {
            id: 4,
            Capacity: "2",
            geoarea: "0.780084985",
            location: [55.749170,37.606310],
            Bussines: 4,
            CA: "14-18"
        },
        {
            id: 5,
            Capacity: "1",
            geoarea: "0.794194843",
            location: [55.736741,37.615964],
            Bussines: 2,
            CA: "14-18"
        },
        {
            id: "6",
            Capacity: "1",
            geoarea: "0.864138389",
            location: [55.748595,37.648695],
            Bussines: 0,
            CA: "14-18"
        },
        {
            id: "7",
            Capacity: "10",
            geoarea: "0.305005524",
            location: [55.708900,37.619541],
            Bussines: 1,
            CA: "19-24"
        },
        {
            id: "8",
            Capacity: "2",
            geoarea: "0.218329588",
            location: [55.750707,37.602278],
            Bussines: 5,
            CA: "19-24"
        },
        {
            id: "9",
            Capacity: "1",
            geoarea: "0.523687761",
            location: [55.752419,37.5971259],
            Bussines: 3,
            CA: "19-24"
        },
        {
            id: "10",
            Capacity: "1",
            geoarea: "0.410223717",
            location: [55.738302,37.627912],
            Bussines: 1,
            CA: "19-24"
        },
        {
            id: "11",
            Capacity: "1",
            geoarea: "0.147814996",
            location: [55.727571,37.581235],
            Bussines: 5,
            CA: "19-24"
        },
        {
            id: "12",
            Capacity: "1",
            geoarea: "0.783032081",
            location: [55.740445,37.620412],
            Bussines: 3,
            CA: "19-24"
        },
        {
            id: "13",
            Capacity: "1",
            geoarea: "0.408933159",
            location: [55.753963,37.653516],
            Bussines: 1,
            CA: "19-24"
        },
        {
            id: "14",
            Capacity: "10",
            geoarea: "0.812291866",
            location: [55.709343,37.639740],
            Bussines: 2,
            CA: "25-34"
        },
        {
            id: "15",
            Capacity: "2",
            geoarea: "0.73330379",
            location: [55.747395,37.584500],
            Bussines: 0,
            CA: "25-34"
        },
        {
            id: "16",
            Capacity: "1",
            geoarea: "0.689060336",
            location: [55.747229,37.5812749],
            Bussines: 4,
            CA: "25-34"
        },
        {
            id: "17",
            Capacity: "1",
            geoarea: "0.716787214",
            location: [55.741693,37.642401],
            Bussines: 2,
            CA: "25-34"
        },
        {
            id: "18",
            Capacity: "1",
            geoarea: "0.793516356",
            location: [55.743430,37.590626],
            Bussines: 0,
            CA: "25-34"
        },
        {
            id: "19",
            Capacity: "2",
            geoarea: "0.661179182",
            location: [55.7358741,37.6138732],
            Bussines: 4,
            CA: "25-34"
        },
        {
            id: "20",
            Capacity: "2",
            geoarea: "0.252547962",
            location: [55.75134,37.6520313],
            Bussines: 2,
            CA: "25-34"
        },
        {
            id: "21",
            Capacity: "1",
            geoarea: "0.974259989",
            location: [55.718344,37.630148],
            Bussines: 3,
            CA: "35-44"
        },
        {
            id: "22",
            Capacity: "1",
            geoarea: "0.827112694",
            location: [55.754164,37.597147],
            Bussines: 1,
            CA: "35-44"
        },
        {
            id: "23",
            Capacity: "1",
            geoarea: "0.9971745",
            location: [55.747229,37.5812749],
            Bussines: 5,
            CA: "35-44"
        },
        {
            id: "24",
            Capacity: "2",
            geoarea: "0.323711249",
            location: [55.7392491,37.6259711],
            Bussines: 3,
            CA: "35-44"
        },
        {
            id: "25",
            Capacity: "1",
            geoarea: "0.088141927",
            location: [55.7186816,37.574664],
            Bussines: 1,
            CA: "35-44"
        },
        {
            id: "26",
            Capacity: "1",
            geoarea: "0.249439634",
            location: [55.728446,37.6108739],
            Bussines: 5,
            CA: "35-44"
        },
        {
            id: "27",
            Capacity: "1",
            geoarea: "0.889086972",
            location: [55.7462185,37.6808414],
            Bussines: 3,
            CA: "35-44"
        },
        {
            id: "28",
            Capacity: "1",
            geoarea: "0.919911",
            location: [55.7144903,37.655829],
            Bussines: 4,
            CA: "45-64"
        },
        {
            id: "29",
            Capacity: "2",
            geoarea: "0.307130156",
            location: [55.753308,37.5843563],
            Bussines: 2,
            CA: "45-64"
        },
        {
            id: "30",
            Capacity: "8",
            geoarea: "0.851185772",
            location: [55.746517,37.557653],
            Bussines: 0,
            CA: "45-64"
        },
        {
            id: "31",
            Capacity: "1",
            geoarea: "0.72720927",
            location: [55.745587,37.637547],
            Bussines: 4,
            CA: "45-64"
        },
        {
            id: "32",
            Capacity: "1",
            geoarea: "0.56648891",
            location: [55.7186816,37.574664],
            Bussines: 2,
            CA: "45-64"
        },
        {
            id: "33",
            Capacity: "1",
            geoarea: "0.891112996",
            location: [55.728446,37.6108739],
            Bussines: 0,
            CA: "45-64"
        },
        {
            id: "34",
            Capacity: "1",
            geoarea: "0.493724715",
            location: [55.7462185,37.6808414],
            Bussines: 4,
            CA: "45-64"
        },
        {
            id: "36",
            Capacity: "1",
            geoarea: "0.416022533",
            location: [55.751269,37.586397],
            Bussines: 3,
            CA: "65+"
        },
        {
            id: "37",
            Capacity: "1",
            geoarea: "0.15612794",
            location: [55.7501089,37.5653886],
            Bussines: 1,
            CA: "65+"
        },
        {
            id: "38",
            Capacity: "1",
            geoarea: "0.918135961",
            location: [55.744467,37.6279449],
            Bussines: 5,
            CA: "65+"
        },
        {
            id: "39",
            Capacity: "1",
            geoarea: "0.841712455",
            location: [55.718678,37.5746579],
            Bussines: 3,
            CA: "65+"
        },
        {
            id: "40",
            Capacity: "6",
            geoarea: "0.324728925",
            location: [55.75134,37.6520313],
            Bussines: 1,
            CA: "65+"
        },
        {
            id: "41",
            Capacity: "1",
            geoarea: "0.167831645",
            location: [55.747213,37.6553607],
            Bussines: 5,
            CA: "65+"
        },
        {
            id: "43",
            Capacity: "1",
            geoarea: "0.571037638",
            location: [55.752929,37.6071779],
            Bussines: 5,
            CA: "Женский"
        },
        {
            id: "44",
            Capacity: "2",
            geoarea: "0.737507766",
            location: [55.733682,37.627545],
            Bussines: 3,
            CA: "Женский"
        },
        {
            id: "45",
            Capacity: "1",
            geoarea: "0.303826497",
            location: [55.7415116,37.6266462],
            Bussines: 1,
            CA: "Женский"
        },
        {
            id: "46",
            Capacity: "8",
            geoarea: "0.306763961",
            location: [55.7417021,37.6185568],
            Bussines: 5,
            CA: "Женский"
        },
        {
            id: "47",
            Capacity: "1",
            geoarea: "0.340956917",
            location: [55.741900,37.653343],
            Bussines: 3,
            CA: "Женский"
        },
        {
            id: "48",
            Capacity: "10",
            geoarea: "0.456976136",
            location: [55.713759,37.594838],
            Bussines: 0,
            CA: "Мужской"
        },
        {
            id: "49",
            Capacity: "1",
            geoarea: "0.497613369",
            location: [55.752929,37.6071779],
            Bussines: 4,
            CA: "Мужской"
        },
        {
            id: "50",
            Capacity: "1",
            geoarea: "0.18083062",
            location: [55.7501089,37.5653886],
            Bussines: 2,
            CA: "Мужской"
        },
        {
            id: "51",
            Capacity: "1",
            geoarea: "0.743621629",
            location: [55.744467,37.6279449],
            Bussines: 0,
            CA: "Мужской"
        },
        {
            id: "52",
            Capacity: "1",
            geoarea: "0.444450679",
            location: [55.718678,37.5746579],
            Bussines: 4,
            CA: "Мужской"
        },
        {
            id: "53",
            Capacity: "8",
            geoarea: "0.618992667",
            location: [55.732403,37.665843],
            Bussines: 2,
            CA: "Мужской"
        },
        {
            id: "54",
            Capacity: "1",
            geoarea: "0.345822939",
            location: [55.747213,37.6553607],
            Bussines: 0,
            CA: "Мужской"
        },
        {
            id: "55",
            Capacity: "1",
            geoarea: "0.217686856",
            location: [55.718507,37.6053369],
            Bussines: 2,
            CA: "Работает"
        },
        {
            id: "56",
            Capacity: "1",
            geoarea: "0.589969521",
            location: [55.752134,37.6060869],
            Bussines: 0,
            CA: "Работает"
        },
        {
            id: "57",
            Capacity: "8",
            geoarea: "0.480728892",
            location: [55.726362,37.636620],
            Bussines: 4,
            CA: "Работает"
        },
        {
            id: "58",
            Capacity: "8",
            geoarea: "0.859529495",
            location: [55.724813,37.580022],
            Bussines: 2,
            CA: "Работает"
        },
        {
            id: "59",
            Capacity: "8",
            geoarea: "0.99304215",
            location: [55.731718,37.617762],
            Bussines: 0,
            CA: "Работает"
        },
        {
            id: "60",
            Capacity: "1",
            geoarea: "0.842102044",
            location: [55.742726,37.646129],
            Bussines: 4,
            CA: "Работает"
        },
        {
            id: "61",
            Capacity: "6",
            geoarea: "0.213579464",
            location: [55.747422,37.585085],
            Bussines: 3,
            CA: "Учится"
        },
        {
            id: "62",
            Capacity: "1",
            geoarea: "0.636221834",
            location: [55.752134,37.6060869],
            Bussines: 1,
            CA: "Учится"
        },
        {
            id: "63",
            Capacity: "1",
            geoarea: "0.579725066",
            location: [55.732783,37.633652],
            Bussines: 5,
            CA: "Учится"
        },
        {
            id: "64",
            Capacity: "2",
            geoarea: "0.936752319",
            location: [55.748975,37.605547],
            Bussines: 3,
            CA: "Учится"
        },
        {
            id: "65",
            Capacity: "2",
            geoarea: "0.462536772",
            location: [55.731383,37.611472],
            Bussines: 1,
            CA: "Учится"
        },
        {
            id: "66",
            Capacity: "1",
            geoarea: "0.940735445",
            location: [55.746349,37.645420],
            Bussines: 5,
            CA: "Учится"
        }
    ],
    
    chartOptionsDay: {
      chart: {
        height: 350,
        type: "area",
      },
      yaxis: [
        {
          title: {
            text: "Отношение",
          },
        },
        {
          opposite: true,
          title: {
            text: "Клиенты",
          },
        },
      ],
      dataLabels: {
        enabled: false,
      },
      labels: {
        show: true,
        style: {
          fontSize: "11px",
          fontFamily: "Arial",
        },
      },
      stroke: {
        curve: "smooth",
      },

      fill: {
        type: "gradient",
        gradient: {
          opacityFrom: 0.6,
          opacityTo: 0.8,
        },
      },
      xaxis: {
        categories: [
          "01.03.2021",
          "02.03.2021",
          "03.03.2021",
          "04.03.2021",
          "05.03.2021",
          "06.03.2021",
          "07.03.2021",
          "08.03.2021",
          "09.03.2021",
          "10.03.2021",
          "11.03.2021",
          "12.03.2021",
          "13.03.2021",
          "14.03.2021",
          "15.03.2021",
          "16.03.2021",
          "17.03.2021",
          "18.03.2021",
          "19.03.2021",
          "20.03.2021",
          "21.03.2021",
          "22.03.2021",
          "23.03.2021",
          "24.03.2021",
          "25.03.2021",
          "26.03.2021",
          "27.03.2021",
          "28.03.2021",
          "29.03.2021",
          "30.03.2021",
          "31.03.2021",
          "01.04.2021",
          "02.04.2021",
          "03.04.2021",
          "04.04.2021",
          "05.04.2021",
          "06.04.2021",
          "07.04.2021",
          "08.04.2021",
          "09.04.2021",
          "10.04.2021",
          "11.04.2021",
          "12.04.2021",
          "13.04.2021",
          "14.04.2021",
          "15.04.2021",
          "16.04.2021",
          "17.04.2021",
          "18.04.2021",
          "19.04.2021",
          "20.04.2021",
          "21.04.2021",
          "22.04.2021",
          "23.04.2021",
          "24.04.2021",
          "25.04.2021",
          "26.04.2021",
          "27.04.2021",
          "28.04.2021",
          "29.04.2021",
          "30.04.2021",
          "01.05.2021",
          "02.05.2021",
          "03.05.2021",
          "04.05.2021",
          "05.05.2021",
          "06.05.2021",
          "07.05.2021",
          "08.05.2021",
          "09.05.2021",
          "10.05.2021",
          "11.05.2021",
          "12.05.2021",
          "13.05.2021",
          "14.05.2021",
          "15.05.2021",
          "16.05.2021",
          "17.05.2021",
          "18.05.2021",
          "19.05.2021",
          "20.05.2021",
          "21.05.2021",
          "22.05.2021",
          "23.05.2021",
          "24.05.2021",
          "25.05.2021",
          "26.05.2021",
          "27.05.2021",
          "28.05.2021",
          "29.05.2021",
          "30.05.2021",
          "31.05.2021",
        ],
      },
    },
    chartOptionsDaySameSize: {
      chart: {
        height: 350,
        type: "area",
      },
      yaxis: [],
      dataLabels: {
        enabled: false,
      },
      labels: {
        show: true,
        style: {
          fontSize: "11px",
          fontFamily: "Arial",
        },
      },
      stroke: {
        curve: "smooth",
      },

      fill: {
        type: "gradient",
        gradient: {
          opacityFrom: 0.6,
          opacityTo: 0.8,
        },
      },
      xaxis: {
        categories: [
          "01.03.2021",
          "02.03.2021",
          "03.03.2021",
          "04.03.2021",
          "05.03.2021",
          "06.03.2021",
          "07.03.2021",
          "08.03.2021",
          "09.03.2021",
          "10.03.2021",
          "11.03.2021",
          "12.03.2021",
          "13.03.2021",
          "14.03.2021",
          "15.03.2021",
          "16.03.2021",
          "17.03.2021",
          "18.03.2021",
          "19.03.2021",
          "20.03.2021",
          "21.03.2021",
          "22.03.2021",
          "23.03.2021",
          "24.03.2021",
          "25.03.2021",
          "26.03.2021",
          "27.03.2021",
          "28.03.2021",
          "29.03.2021",
          "30.03.2021",
          "31.03.2021",
          "01.04.2021",
          "02.04.2021",
          "03.04.2021",
          "04.04.2021",
          "05.04.2021",
          "06.04.2021",
          "07.04.2021",
          "08.04.2021",
          "09.04.2021",
          "10.04.2021",
          "11.04.2021",
          "12.04.2021",
          "13.04.2021",
          "14.04.2021",
          "15.04.2021",
          "16.04.2021",
          "17.04.2021",
          "18.04.2021",
          "19.04.2021",
          "20.04.2021",
          "21.04.2021",
          "22.04.2021",
          "23.04.2021",
          "24.04.2021",
          "25.04.2021",
          "26.04.2021",
          "27.04.2021",
          "28.04.2021",
          "29.04.2021",
          "30.04.2021",
          "01.05.2021",
          "02.05.2021",
          "03.05.2021",
          "04.05.2021",
          "05.05.2021",
          "06.05.2021",
          "07.05.2021",
          "08.05.2021",
          "09.05.2021",
          "10.05.2021",
          "11.05.2021",
          "12.05.2021",
          "13.05.2021",
          "14.05.2021",
          "15.05.2021",
          "16.05.2021",
          "17.05.2021",
          "18.05.2021",
          "19.05.2021",
          "20.05.2021",
          "21.05.2021",
          "22.05.2021",
          "23.05.2021",
          "24.05.2021",
          "25.05.2021",
          "26.05.2021",
          "27.05.2021",
          "28.05.2021",
          "29.05.2021",
          "30.05.2021",
          "31.05.2021",
        ],
      },
    },
    ontSmiSocDay: [
      {
        name: "Отношение",
        type: "column",
        data: [
          0.141,
          0.123,
          0.24,
          0.318,
          0.389,
          0.392,
          0.191,
          0.375,
          0.258,
          0.183,
          0.182,
          0.294,
          0.295,
          0.429,
          0.392,
          0.204,
          0.187,
          0.252,
          0.23,
          0.463,
          0.114,
          0.136,
          0.11,
          0.128,
          0.327,
          0.401,
          0.402,
          0.205,
          0.135,
          0.496,
          0.423,
          0.125,
          0.415,
          0.269,
          0.499,
          0.446,
          0.117,
          0.237,
          0.211,
          0.418,
          0.236,
          0.475,
          0.27,
          0.361,
          0.498,
          0.278,
          0.401,
          0.448,
          0.48,
          0.107,
          0.263,
          0.261,
          0.339,
          0.25,
          0.481,
          0.42,
          0.282,
          0.108,
          0.202,
          0.169,
          0.212,
          0.409,
          0.355,
          0.261,
          0.485,
          0.33,
          0.315,
          0.179,
          0.231,
          0.387,
          0.27,
          0.205,
          0.128,
          0.229,
          0.194,
          0.101,
          0.128,
          0.2,
          0.279,
          0.227,
          0.23,
          0.144,
          0.25,
          0.388,
          0.313,
          0.348,
          0.194,
          0.328,
          0.387,
          0.293,
          0.218,
          0.473,
        ],
      },
      {
        name: "Постоянные клиенты",
        type: "line",
        data: [
          33,
          17,
          15,
          38,
          49,
          9,
          41,
          12,
          22,
          33,
          43,
          14,
          25,
          23,
          18,
          30,
          21,
          7,
          49,
          47,
          16,
          27,
          16,
          32,
          9,
          14,
          25,
          7,
          33,
          23,
          42,
          22,
          31,
          13,
          8,
          4,
          11,
          48,
          35,
          28,
          21,
          17,
          42,
          21,
          26,
          31,
          48,
          20,
          29,
          37,
          36,
          14,
          34,
          30,
          19,
          37,
          36,
          20,
          32,
          9,
          14,
          25,
          6,
          49,
          40,
          42,
          5,
          14,
          25,
          41,
          48,
          19,
          27,
          21,
          48,
          31,
          43,
          14,
          25,
          5,
          43,
          21,
          20,
          49,
          19,
          30,
          10,
          10,
          44,
          3,
          6,
          47,
        ],
      },
      {
        name: "Новые клиенты",
        type: "line",
        data: [
          4,
          1,
          1,
          2,
          3,
          0,
          2,
          1,
          2,
          2,
          3,
          1,
          2,
          1,
          1,
          1,
          1,
          0,
          5,
          3,
          1,
          2,
          1,
          4,
          0,
          1,
          2,
          0,
          2,
          1,
          2,
          1,
          2,
          1,
          1,
          0,
          0,
          2,
          3,
          2,
          1,
          1,
          4,
          1,
          1,
          2,
          4,
          1,
          2,
          4,
          2,
          1,
          5,
          2,
          1,
          2,
          2,
          2,
          0,
          5,
          5,
          2,
          0,
          1,
          1,
          4,
          4,
          1,
          2,
          1,
          1,
          1,
          1,
          0,
          5,
          3,
          1,
          3,
          1,
          3,
          1,
          0,
          4,
          3,
          4,
          1,
          4,
          1,
          1,
          2,
          0,
          1,
        ],
      },
    ],
  }),
};
</script>
