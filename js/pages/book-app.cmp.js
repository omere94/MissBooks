import { bookService } from '../services/book.service.js';
import bookList from '../cmps/book-list.cmp.js';
import bookFilter from '../cmps/book-filter.cmp.js';
import bookDetails from './book-details.cmp.js';

export default {
    template: `
        <section class="book-app app-main">
            <book-filter @filtered="setFilter" />
            <book-details v-if="selectedBook" :book="selectedBook" @close="closeDetails" />
            <book-list v-else :books="booksToShow"  @selected="selectBook" />
        </section>`,
    data() {
        return {
            books: null,
            selectedBook: null,
            filterBy: null
        };
    },
    created() {
        this.loadBooks();
    },
    methods: {
        loadBooks() {
            bookService.query()
                .then(books => this.books = books);
        },
        removeBook(id) {
            bookService.remove(id);
        },
        selectBook(book) {
            this.selectedBook = book;
        },
        closeDetails() {
            this.selectedBook = null;
        },
        setFilter(filterBy) {
            this.filterBy = filterBy;
        }
    },
    computed: {
        booksToShow() {
            if (!this.filterBy) return this.books;
            const searchStr = this.filterBy.title.toLowerCase();
            const lowPrice = this.filterBy.fromPrice || 0
            const highPice = this.filterBy.toPrice || Infinity
            const booksToShow = this.books.filter(book => {
                return book.title.toLowerCase().includes(searchStr) &&
                    book.listPrice.amount >= lowPrice &&
                    book.listPrice.amount <= highPice
            });
            return booksToShow;
        }
    },
    components: {
        bookList,
        bookFilter,
        bookDetails,
    }
};