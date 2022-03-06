import { bookService } from '../services/book.service.js';
import { eventBus } from '../services/event-bus-service.js';

export default {
    template: `
        <div class="review-add app-main">
            <h3>Add a new review</h3>
            <form  @submit.prevent="save" class="review-form">
                <input v-model="review.fullName" type="text" placeholder="Full name">
                <div class="stars">
                    <span v-for="num in 5" class="fa fa-star" :class="{checked:num<=review.rate}" @click="changeColor(num)">
                    </span>
                </div>                    
               <div> <label> Read at:</label> <input v-model="review.readAt" type="date" name="" id=""></div>
                <textarea v-model="review.content"placeholder="Your review comes here -->" rows="5" required></textarea>
                <button>Save</button>
            </form>
        </div>`,
    data() {
        return {
            bookToEdit: null,
            review: {
                fullName: null,
                rate: 3,
                readAt: new Date().toISOString().split('T')[0],
                content: null,
            }
        }
    },
    created() {
        const { bookId } = this.$route.params;
        bookService.getById(bookId)
            .then(book => this.bookToEdit = book)
    },
    methods: {
        save() {
            this.review.fullName = this.review.fullName || 'Books Reader'
            this.review.readAt = this.review.readAt || new Date().toISOString().split('T')[0];
            if (this.bookToEdit.reviews) this.bookToEdit.reviews.push(this.review)
            else this.bookToEdit['reviews'] = [this.review]
            bookService.addReview(this.review, this.bookToEdit.id)
                .then(() => {
                    const msg = {
                        txt: 'Review added successfully',
                        type: 'success'
                    };
                    this.$router.push('/book/' + this.bookToEdit.id)
                    eventBus.$emit('showMsg', msg);
                })
                .catch(err => {
                    console.log('err', err);
                    const msg = {
                        txt: 'Error. Please try later',
                        type: 'error'
                    };
                    eventBus.$emit('showMsg', msg);
                });
        },
        changeColor(num) {
            this.review.rate = num;
            console.log('hello', num)
        }
    },
};