export default {
    props: ['txt'],
    template: `
      <div>
        <p v-if="!showMore">Description: {{txtToShow}}</p>
        <p v-else>Description: {{txt}}</p>
        <button v-if="over100" @click="showMore=!showMore" class="show-more-btn">{{btnTxt}}</button>
      </div> `,
    data() {
        return {
            over100: false,
            showMore: false
        }
    },
    computed: {
        txtToShow() {
            if (this.txt.length <= 100) {
                return this.txt
            }
            else {
                this.over100 = true
                return this.txt.substring(0, 101) + "..."
            }
        },
        btnTxt() {
            if (this.showMore) return 'Read less'
            else return 'Read more'
        }
    }
};