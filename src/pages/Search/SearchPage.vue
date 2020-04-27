<template>

  <q-page>
    <div class="q-pa-md">
      <q-input
        class="q-pb-md"
        outlined
        :color="'primary'"
        dense
        :debounce="searchDebounce"
        v-model="filter"
        :placeholder=" 'Search'"
        :class="$q.screen.width <= 405 ? 'full-width' : ''"
      >
        <template v-slot:append>
          <q-icon
            name="mdi-magnify"
            :color="'primary'"
          />
        </template>
      </q-input>
      <q-table
        style="height: 400px"
        title="Treats"
        :data="dataTracks"
        :columns="columns"
        row-key="id"
        virtual-scroll
        :pagination.sync="pagination"
        :rows-per-page-options="[0]"
      >
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn dense round flat color="grey" @click="play()" icon="pause"></q-btn>
            <q-btn dense round flat color="grey" @click="deleteRow(props)" icon="play_arrow"></q-btn>
          </q-td>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script>
import DynamicTable from 'components/Tables/Dynamic'
import EventBus from "assets/utils/EventBus";

var SpotifyWebApi = require('spotify-web-api-node');
var dataTracksArray = []
export default {
  name: 'SearchPage',
  components: {
    DynamicTable
  },
  watch: {
    tracks: function (val) {

      var test = Object.assign({}, val)
      console.log(test[0].name);
      this.dataTracks = []
      for (let index = 0; index < val.length; index++) {
        const element = val[index];
        this.dataTracks.push(element)
      }
    },
    filter: function (val, oldval) {
      this.$store.dispatch('spotifyAuth/search', val)
  }
  },
  computed: {
    tracks () {
      return this.$store.state.spotifyAuth.search_tracks.items
    }
  },
  mounted () {
    console.log(this.$store.state.spotifyAuth.user.accessToken);
  },
  methods: {
    play() {
      this.$store.dispatch('spotifyAuth/getToken')

    },
    modeChanged () {
      console.log('modechanged', this.selectionMode)
    },
    doAction (val) {
      console.log('onAction', val)
    },
    pagChange (evt) {
      console.log('pagChange', evt)
      this.pagination = evt
    }
  },
  data () {
    return {

      dataTracksArray: [],
      searchDebounce: 1000,
      dataTracks: [],
      pagination: { rowsPerPage: 10, page: 1 },
      tableTitle: 'Search Music',
      selectionMode: 'none',
      loading: false,
      filter: '',
      // selected: [],
      columns: [
        {
          name: 'name',
          required: true,
          label: 'name',
          align: 'left',
          field: 'name',
          // format: val => `${val}`,
          sortable: true
        },
        // {
        //   name: 'id',
        //   align: 'center',
        //   label: 'id',
        //   field: 'id',
        //   sortable: true,
        //   // isRating: false,
        //   // style: 'width: 150px'
        // },
         { name: 'actions', label: 'Actions', field: '', align:'center' },
        {
          name: 'artist',
          align: 'center',
          label: 'Rating',
          field: row => row.artists.map(artist => {
            return artist.name + " "
          }),
          sortable: true,
          // isRating: false,
          // style: 'width: 150px'
        }

      ],
      data: this.dataTracks

    }
  },

  created () {
    EventBus.$on('search_tracks', ([payload]) => {
       console.log(payload);
    })

   }

}
</script>
