<template>

  <q-page>
    <div class="q-pa-md">
      <div class="text-center">
        <spotify-logo></spotify-logo>
      </div>
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
        <!-- style="height: 400px" -->
      <q-table
            style="max-height: 400px"

        v-if="dataTracks.length > 0"
        title="Search"
        :data="dataTracks"
        :columns="columns"
        :dense="true"
        row-key="id"
        virtual-scroll
        :pagination.sync="pagination"
        :rows-per-page-options="[0]"
        @request="onRequest"

      >
        <!-- @virtual-scroll="onRequest" -->
            <template v-slot:body-cell-name="props">
        <q-td :props="props">
          <div>
            <p style="font-weight: bold; margin-bottom: 0px;">{{props.value}}</p>
          </div>
          <div class="text-sm  my-table-artists">
            {{ props.row.artists.map(artist => {
              return artist.name + " "
            }).toString()  }}
          </div>
        </q-td>
      </template>
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn
              dense
              round
              flat
              color="grey"
              @click="pause()"
              icon="pause"
            ></q-btn>
            <q-btn
              dense
              round
              flat
              color="grey"
              @click="play(props)"
              icon="play_arrow"
            ></q-btn>
          </q-td>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script>
import DynamicTable from 'components/Tables/Dynamic'
import EventBus from "assets/utils/EventBus";
import SpotifyLogo from 'components/Partials/SpotifyLogo'
var SpotifyWebApi = require('spotify-web-api-node');
var dataTracksArray = []
export default {
  name: 'SearchPage',
  components: {
    DynamicTable,
    SpotifyLogo
  },
  watch: {
    tracks: function (val) {
      var test = Object.assign({}, val)
      this.dataTracks = []
      for (let index = 0; index < val.length; index++) {
        const element = val[index];
        this.dataTracks.push(element)
      }
    },
    paginationInfo: function (val, oldval) {

      this.$set(this.pagination, 'rowsNumber', val.total)

    },
    filter: function (val, oldval) {

      this.$store.dispatch('spotifyAuth/search', {
        offset: 0,
        limit: this.paginationInfo.rowsPerPage || 10,
        term: val
      })
    }
  },
  computed: {
    tracks () {
      return this.$store.state.spotifyAuth.search_tracks.items
    },
    paginationInfo () {
      return this.$store.state.spotifyAuth.search_tracks_pagination
    }
  },
  mounted () {
    console.log(this.$store.state.spotifyAuth.user.accessToken);
  },
    data () {
    return {
      dataTracksArray: [],
      searchDebounce: 1000,
      dataTracks: [],
      // pagination: { rowsPerPage: 10, page: 1 },

      tableTitle: 'Search Music',
      selectionMode: 'none',
      loading: false,
      filter: '',
      // selected: [],
      pagination: {
        sortBy: 'desc',
        descending: false,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: this.paginationInfo || 11
      },
      columns: [
        {
          name: 'name',
          required: true,
          label: 'Name',
          align: 'left',
          field: 'name',
          // format: val => `${val}`,
          sortable: true
        },
        // {
        //   // style: 'max-width: 50px',
        //   name: 'artist',
        //   align: 'left',
        //   label: 'Artists',
        //   field: row => row.artists.map(artist => {
        //     return artist.name + " "
        //   }),
        //   sortable: true,
        //   // isRating: false,
        //   // isRating: false,
        // },
        { name: 'actions', label: 'Actions', field: '', align: 'center' }

      ],
      data: this.dataTracks

    }
  },
  methods: {
    onRequest (props) {
      const { page, rowsPerPage, sortBy, descending } = props.pagination
      console.log(props);
      this.loading = true

      // console.log(page, rowsPerPage, sortBy, descending, this.$store.state.spotifyAuth.search_tracks_pagination);
      this.paginationInfo.page
      this.$store.dispatch('spotifyAuth/search', {
        offset: page * rowsPerPage,
        limit: rowsPerPage,
        term: this.filter
      })
      this.$set(this.pagination, 'rowsNumber', this.paginationInfo.total)

      this.pagination.page = page
      this.pagination.rowsPerPage = rowsPerPage
      this.pagination.sortBy = sortBy
      this.pagination.descending = descending


        this.loading = false

      return
      var data = {



      }



      // emulate server
      setTimeout(() => {
        // update rowsCount with appropriate value
        this.pagination.rowsNumber = this.getRowsNumberCount(filter)

        // get all rows if "All" (0) is selected
        const fetchCount = rowsPerPage === 0 ? this.pagination.rowsNumber : rowsPerPage

        // calculate starting row of data
        const startRow = (page - 1) * rowsPerPage

        // fetch data from "server"
        const returnedData = this.fetchFromServer(startRow, fetchCount, filter, sortBy, descending)

        // clear out existing data and add new
        this.data.splice(0, this.data.length, ...returnedData)

        // don't forget to update local pagination object
        this.pagination.page = page
        this.pagination.rowsPerPage = rowsPerPage
        this.pagination.sortBy = sortBy
        this.pagination.descending = descending

        // ...and turn of loading indicator
        this.loading = false
      }, 1500)
    },

    // emulate ajax call
    // SELECT * FROM ... WHERE...LIMIT...
    fetchFromServer (startRow, count, filter, sortBy, descending) {
      const data = filter
        ? this.original.filter(row => row.name.includes(filter))
        : this.original.slice()

      // handle sortBy
      if (sortBy) {
        const sortFn = sortBy === 'desc'
          ? (descending
            ? (a, b) => (a.name > b.name ? -1 : a.name < b.name ? 1 : 0)
            : (a, b) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0)
          )
          : (descending
            ? (a, b) => (parseFloat(b[sortBy]) - parseFloat(a[sortBy]))
            : (a, b) => (parseFloat(a[sortBy]) - parseFloat(b[sortBy]))
          )
        data.sort(sortFn)
      }

      return data.slice(startRow, startRow + count)
    },

    // emulate 'SELECT count(*) FROM ...WHERE...'
    getRowsNumberCount (filter) {
      if (!filter) {
        return this.original.length
      }
      let count = 0
      this.original.forEach((treat) => {
        if (treat.name.includes(filter)) {
          ++count
        }
      })
      return count

    },
    play () {
      this.$store.dispatch('spotifyAuth/play')
    },
    pause () {
      this.$store.dispatch('spotifyAuth/pauses')
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


  created () {
    EventBus.$on('search_tracks', ([payload]) => {
      console.log(payload);
    })

  }

}
</script>
