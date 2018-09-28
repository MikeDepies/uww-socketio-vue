<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
        <v-layout row>
    <v-flex xs12 sm6 offset-sm3>
      <v-card>
        <v-toolbar color="cyan" dark>
          <v-toolbar-side-icon></v-toolbar-side-icon>

          <v-toolbar-title>Messages</v-toolbar-title>

          <v-spacer></v-spacer>
          <v-tooltip bottom>
          <v-btn 
          icon
          large
          slot="activator"
          @click="editCount=true">
            <v-icon large>settings</v-icon>
          </v-btn>
          <span>Change number of messages</span>
          </v-tooltip>
          <v-text-field v-if="editCount" autofocus v-model="count" mask="###" @blur="editCount=false"></v-text-field>
          <v-tooltip bottom>
            <v-btn
              @click="logout"
              icon
              large
              slot="activator"
            >
              <v-icon large>logout</v-icon>
            </v-btn>
            <span>Logout</span>
          </v-tooltip>
        </v-toolbar>

        <v-list two-line>
          <transition-group name="list" tag="p">
          <template v-for="(item, index) in messageSet">
          
            <v-list-tile
              class="list-item"
              :key="index"
              avatar
              @click=""
            >
              <v-list-tile-avatar>
                <v-avatar :color="color(item.username)">
                  <span class="white--text headline">{{avatar(item.username)}}</span>
                </v-avatar>
              </v-list-tile-avatar>

              <v-list-tile-content>
                <v-list-tile-title v-html="item.username"></v-list-tile-title>
                <v-list-tile-sub-title v-html="item.msg"></v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
          </template>
          </transition-group>
        </v-list>
          <v-form @submit.prevent="sendMessage">
        <v-layout row>
            <v-flex sm12><v-text-field v-model="msg" 
            :autofocus="true"
            label="Message"></v-text-field></v-flex>
            <v-flex><v-btn :disabled="!(msg)" @click="sendMessage" >Send</v-btn></v-flex>
        </v-layout>
          </v-form>
      </v-card>
    </v-flex>
  </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

<script>
var colors = [
  "red",
  "pink",
  "purple",
  "deep-purple",
  "indigo",
  "blue",
  "light-blue",
  "cyan",
  "teal",
  "green",
  "light-green",
  "lime",
  "yellow",
  "amber",
  "orange",
  "deep-orange",
  "brown",
  "blue-grey"
];
export default {
  data() {
    return {
      editCount: false,
      count: 10,
      msg: "",
      messages: []
    };
  },
  props: {
    username: String
  },
  sockets: {
    connect: function() {
      console.log("socket connected");
    },
    disconnect: function() {
      console.log("disconnect");
    },
    messages: function(data) {
      var c = this;
      console.log(data);
      data.forEach(element => c.appendMessage(element));
    },
    "chat message": function(data) {
      this.appendMessage(data);
    }
  },
  mounted() {
    if (this.$socket.disconnected) this.$socket.connect();
    console.log(this.$socket);
  },
  destroyed() {
    this.$socket.disconnect();
  },
  computed: {
    messageSet() {
      let count = this.count;
      if (count == 0) return this.messages;
      return this.messages.slice(Math.max(this.messages.length - count, 1));
    }
  },
  methods: {
    appendMessage(data) {
      this.messages.push(data);
      // if (this.messages.length > 10) this.messages.shift()
    },
    logout() {
      this.$emit("logout");
    },
    sendMessage() {
      console.log(this.msg);
      let payload = {
        msg: this.msg,
        username: this.username
      };
      if (this.msg === "/logout") {
        this.logout();
      } else {
        this.$socket.emit("chat message", payload);
      }
      this.msg = "";
    },
    color(name) {
      var value = name.charCodeAt(0) + name.charCodeAt(name.length - 1);
      return colors[value % colors.length];
    },
    avatar(name) {
      // if (name.length > 1)
      //   return name[0].toUpperCase() + name[name.length-1].toUpperCase();
      // else
        return name[0].toUpperCase();
    }
  }
};
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.list-item {
  margin-right: 10px;
}
.list-enter-active,
.list-leave-active {
  transition: all 1s;
}
.list-enter, .list-leave-to /* .list-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
