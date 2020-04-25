<template>
  <q-page padding>
    <!-- content -->
    <q-page class="q-pa-md body-class">
      <template v-if="data">
        <dynamic-table
          :title="'Search Music'"
          :data="data"
          :columns="columns"
          :actions="['action 1', 'action 2', 'action 3']"
          :search-field="filter"
          :inner-loading="loading"
          theme="secondary"
          @search-change="filter = $event"
          :selection-mode="selectionMode"
          @selection-mode-change="
          selectionMode =  'single'
          modeChanged()
        "
          @action-1="doAction"
          @action-2="doAction"
          :grid="$q.platform.is.mobile"
          actions-display-type="bottom menu"
          action-invoke-type="instant"
          search-input-placeholder="Search Name"
          search
          grid-card-style="vertical"
          :row-options="[5, 10, 20, 30, 40, 50]"
          :pagination="pagination"
          ref="table"
          @update:pagination="pagChange"
        />
      </template>
      <template v-else>
        <span>No data, do something like fetch data from server etc...</span>
      </template>
    </q-page>
  </q-page>
</template>

<script>
import DynamicTable from 'components/Tables/Dynamic'

var SpotifyWebApi = require('spotify-web-api-node');

export default {
  components: {
    DynamicTable
  },
  name: 'SearchPage',
  mounted () {
    console.log(this.$store.state.spotifyAuth.user.accessToken);

    var spotifyApi = new SpotifyWebApi({});
    console.log(spotifyApi);

    spotifyApi.setAccessToken(this.$store.state.spotifyAuth.user.accessToken);

    spotifyApi.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE').then(
      function (data) {
        console.log('Artist albums', data.body);
      },
      function (err) {
        console.error(err);
      }
    );
  },
  methods: {
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
      pagination: { rowsPerPage: 10, page: 1 },
      tableTitle: 'Search Music',
      selectionMode: 'single',
      loading: false,
      filter: '',
      selected: [],
      columns: [
        {
          name: 'name',
          required: true,
          label: 'Dessert (100g serving)',
          align: 'left',
          field: row => row.name,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: 'rating',
          align: 'center',
          label: 'Rating',
          field: 'rating',
          sortable: true,
          isRating: true,
          style: 'width: 150px'
        },
        {
          name: 'calories',
          align: 'center',
          label: 'Calories',
          field: 'calories',
          sortable: true
        },
        { name: 'fat', label: 'Fat (g)', field: 'fat', sortable: true },
        { name: 'carbs', label: 'Carbs (g)', field: 'carbs' },
        { name: 'protein', label: 'Protein (g)', field: 'protein' },
        { name: 'sodium', label: 'Sodium (mg)', field: 'sodium' },
        {
          name: 'calcium',
          label: 'Calcium (%)',
          field: 'calcium',
          sortable: true,
          sort: (a, b) => parseInt(a, 10) - parseInt(b, 10)
        },
        {
          name: 'iron',
          label: 'Iron (%)',
          field: 'iron',
          sortable: true,
          sort: (a, b) => parseInt(a, 10) - parseInt(b, 10)
        }
      ],
      data: [
        {
          // name: 'Frozen Yogurt',
          // calories: 159,
          // fat: 6.0,
          // carbs: 24,
          // protein: 4.0,
          // sodium: 87,
          // calcium: '14%',
          // iron: '1%',
          // rating: 1
        }

      ]
    }
  },
  watch: {
    filter: function (val, oldval) {

      this.$store.dispatch('spotifyAuth/search',val)
      // console.log();

    }
  },
  created () { }

}
</script>
