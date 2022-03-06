import longText from '../cmps/long-text.cmp.js';
import { bookService } from '../services/book.service.js';
import reviewAdd from '../pages/review-add.cmp.js';
import { eventBus } from '../services/event-bus-service.js';


export default {
    template: `
        <section v-if="book" class="book-details">
            <h3>{{ titleToShow }}</h3>
            <p v-if="book.listPrice.isOnSale" class="sale">ON SALE!</p>
            <ul>
                <li>
                  <span class="underline">Author:</span>
                    {{ (book.authors).join(' , ')}}
                </li>
                <li>
                  <span class="underline">Subtitle:</span> {{ book.subtitle }}
                </li>
                <li>
                  <span class="underline">Published at:</span>
                   {{ publishedToShow }}
                </li>
                <li>
                  <span class="underline">Description:</span> 
                  <long-text v-bind:txt="book.description"/>
                </li>
                <li>
                  <span class="underline">PageCount:</span>
                   {{ pagesToShow }} 
                </li>
                <li>
                  <span class="underline">Categories:</span>
                  {{ (book.categories).join(' , ') }}
                </li>
                <li>
                  <span class="underline">Language:</span> {{ book.language }}
                </li>
                <li>
                  <span class="underline">Price:</span >
                  <span :class="priceStyle"> 
                    {{ priceToShow }} 
                  </span>
                </li>
            </ul>
            <p v-if="!book.reviews||!book.reviews.length">No reviews</p>
            <div v-else class="reviews" >
            <h1 class="underline">reviews:</h1>
            <div class="reviews-container">
            <ul v-for="(review, idx) in book.reviews" class="review-container" :key=idx>
              <li> <span class="underline">Review from:</span> {{review.fullName}}</li>
              <li><span class="underline">Rating:</span> 
                <span v-for="num in review.rate" class="fa fa-star checked">
                </span> </li>
              <li><span class="underline"> Read at:</span> {{review.readAt}} </li>
              <li><div class="underline">Review:</div> {{review.content}} </li>
              <button @click=remove(idx)>Delete</button>
            </ul>
          </div>
          </div>
            <router-link :to="'/book/'+ this.book.id +'/review-add'">Add review</router-link>
            <router-link to="/book" class="close-details">X</router-link>
        </section>`,
    data() {
        return {
            book: null
        };
    },
    created() {
        const { bookId } = this.$route.params;
        bookService.getById(bookId)
            .then(book => this.book = book);
    },
    methods: {
        remove(idx) {
            this.book.reviews.splice(idx, 1);
            bookService
                .save(this.book)
                .then(() => {
                    const msg = {
                        txt: 'Review deleted successfully',
                        type: 'success',
                    };
                    eventBus.$emit('showMsg', msg);
                })
                .catch((err) => {
                    console.log('err', err);
                    const msg = {
                        txt: 'Error. Please try later',
                        type: 'error',
                    };
                    eventBus.$emit('showMsg', msg);
                });
        },
    },
    computed: {
        titleToShow() {
            return this.book.title[0].toUpperCase() + this.book.title.substring(1)
        },
        authorsToShow() {
            return this.book.authors.join()
        },
        categoriesToShow() {
            return this.book.categories.join()
        },
        priceToShow() {
            let sign
            switch (this.book.listPrice.currencyCode) {
                case 'EUR':
                    sign = '€'
                    break
                case 'ILS':
                    sign = '₪'
                    break
                case 'USD':
                    sign = '$'
                    break
            }
            return this.book.listPrice.amount + sign
        },
        pagesToShow() {
            let pages = this.book.pageCount
            if (pages > 500) return pages + ' Long reading'
            if (pages > 200) return pages + ' Decent reading'
            if (pages < 100) return pages + ' Light reading'
            else return pages
        },
        publishedToShow() {
            let year = +this.book.publishedDate
            if (year < new Date().getFullYear() - 10) return year + ' Veteran Book'
            if (year > new Date().getFullYear() - 1) return year + ' New!'
            else return year

        },
        priceStyle() {
            return {
                red: this.book.listPrice.amount > 150,
                green: this.book.listPrice.amount < 20,
            }
        },

    },
    components: {
        longText,
        reviewAdd,
    }
}