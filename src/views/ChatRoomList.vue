<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title class="text-center text-h5">채팅방 목록</v-card-title>
          <v-card-text>
            <v-table>
              <thead>
                <tr>
                  <th>채팅 키워드</th>
                  <th>현재 참여 인원</th>
                  <th>최대 참여 인원</th>
                  <th>참여</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="chat in chatRoomList" :key="chat.roomKeyword">
                  <td>{{ chat.roomKeyword }}</td>
                  <td>{{ chat.participants.length }}</td>
                  <td>{{ chat.maximumCount }}</td>
                  <td>
                    <v-btn
                      color="primary"
                      @click="joinChatRoom(chat.roomKeyword)"
                    >
                      참여하기
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ChatRoomList',
  data() {
    return {
      chatRoomList: [],
    };
  },
  async created() {
    this.loadChatRoom();
  },
  methods: {
    async joinChatRoom(roomKeyword) {
      // 웹소켓 연결은 여기서 생성하지 않고, 단순히 채팅 페이지로 이동만 합니다.
      this.$router.push(`/chatpage/${roomKeyword}`);
    },
    async loadChatRoom() {
      const response = await axios.get(
        `${process.env.VUE_APP_BASE_URL}/api/v1/chat-rooms`,
      );
      this.chatRoomList = response.data;
    },
  },
};
</script>
