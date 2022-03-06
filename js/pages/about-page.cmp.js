import { eventBus } from '../services/event-bus-service.js';

export default {
    template: `
            <section class="about-page app-main">
            <h1>About My Shop</h1>
            <transition name="fade" v-if="interval">
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                Dicta minus facere corporis optio veniam! Cupiditate, harum, 
                unde iure architecto ab expedita delectus ratione veniam animi sed qui, rem alias ipsam?</p>
            </transition>
            <img src="./img/about.jpg" alt="" class="home-bg">
        </section>`,
    data() {
        return {
            interval: null
        }
    },
    methods: {
    },
    created() {
        this.interval = setInterval(() => {
            console.log('Welcome home')
        }, 1000);
        console.log('Created');
    },
    mounted() {
        console.log('Mounted');
        console.log(this.$refs.header);
    },
    destroyed() {
        clearInterval(this.interval)
        console.log('Bye Bye')
    }
};