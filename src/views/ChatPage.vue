<template>
  <v-container fluid>
    <v-row class="content-row" align="start">
      <!-- 왼쪽: 참여자 목록 및 채팅방 제목 -->
      <v-col cols="12" md="3">
        <v-card class="participant-card">
          <v-card-title class="participant-title">
            {{ roomKeyword }} 채팅방<br />참여자 목록
          </v-card-title>
          <v-card-text>
            <v-list dense>
              <v-list-item
                v-for="(participant, index) in participants"
                :key="index"
              >
                <v-list-item-content>
                  <v-list-item-title>{{
                    formatParticipant(participant)
                  }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
      <!-- 오른쪽: 채팅 영역 -->
      <v-col cols="12" md="9">
        <v-card class="chat-area-card">
          <v-card-text>
            <div class="chat-box">
              <div
                v-for="(msg, index) in messages"
                :key="index"
                :class="[
                  'chat-message',
                  formatUserToken(msg.userToken) === formattedSender
                    ? 'sent'
                    : 'received',
                ]"
              >
                <div class="message-content">
                  <span class="user-id">{{
                    formatUserToken(msg.userToken)
                  }}</span
                  ><br />
                  <span class="text">{{ msg.message }}</span>
                </div>
                <div
                  v-if="
                    formatUserToken(msg.userToken) !== formattedSender &&
                    msg.unreadCount > 0
                  "
                  class="read-indicator"
                >
                  {{ msg.unreadCount }}명 읽음
                </div>
              </div>
            </div>
            <v-text-field
              v-model="newMessage"
              label="메시지 입력"
              @compositionstart="composing = true"
              @compositionend="handleCompositionEnd"
              @keyup.enter.prevent="handleEnter($event)"
            />
            <!-- 버튼 행: 전송 버튼(8컬럼)과 나가기 버튼(4컬럼) -->
            <v-row class="button-row" dense>
              <v-col cols="8">
                <v-btn color="primary" block @click="sendMessage">전송</v-btn>
              </v-col>
              <v-col cols="4">
                <v-btn color="primary" block @click="leaveChatRoom"
                  >나가기</v-btn
                >
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import SockJS from 'sockjs-client';
import Stomp from 'webstomp-client';
import axios from 'axios';

export default {
  name: 'ChatPage',
  data() {
    return {
      messages: [],
      newMessage: '',
      participants: [],
      stompClient: null,
      senderToken: null, // 로컬스토리지에 저장된 토큰 (JSON 문자열)
      roomKeyword: null,
      connectionError: false,
      reconnectAttempts: 0,
      maxReconnectAttempts: 5,
      reconnectDelay: 2000, // ms
      heartbeatInterval: null,
      heartbeatDelay: 10000, // 10초 간격
      sending: false, // 중복 전송 방지 플래그
      composing: false, // IME 조합 중 여부
    };
  },
  computed: {
    formattedSender() {
      return this.formatUserToken(this.senderToken);
    },
  },
  created() {
    this.senderToken = localStorage.getItem('guestToken');
    this.roomKeyword = this.$route.params.roomKeyword;
    this.connectWebsocket();
  },
  beforeRouteLeave(to, from, next) {
    this.disconnectWebSocket();
    next();
  },
  beforeUnmount() {
    this.disconnectWebSocket();
  },
  methods: {
    connectWebsocket() {
      if (this.stompClient && this.stompClient.connected) return;
      this.connectionError = false;
      const socket = new SockJS(`${process.env.VUE_APP_BASE_URL}/ws/connect`);
      socket.onerror = (errorEvent) => {
        console.error('SockJS error event:', errorEvent);
        this.handleConnectionError({ body: 'WebSocket error' });
      };
      this.stompClient = Stomp.over(socket);
      this.stompClient.debug = () => {};
      this.stompClient.connect(
        { roomKeyword: this.roomKeyword, userToken: this.senderToken },
        () => {
          console.log('STOMP 연결 성공');
          this.reconnectAttempts = 0;
          this.subscribeToTopics();
          this.startHeartbeat();
          // 연결 후 참여자 목록 요청
          this.stompClient.send(
            `/ws/publish/${this.roomKeyword}/participants`,
            '',
          );
        },
        (error) => {
          this.handleConnectionError(error);
        },
      );
    },
    handleCompositionEnd() {
      this.composing = false;
    },
    handleEnter(event) {
      if (event.isComposing || this.composing) return;
      this.sendMessage();
    },
    handleConnectionError(error) {
      this.connectionError = true;
      const errorMessage = error.body || error.toString();
      if (errorMessage.includes('해당 채팅방 인원수가 초과하였습니다')) {
        alert('해당 채팅방 인원수가 초과하였습니다.');
      } else {
        alert('STOMP 연결 실패: ' + errorMessage);
      }
      this.disconnectWebSocket();
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        setTimeout(() => {
          console.log(`재연결 시도 ${this.reconnectAttempts}회`);
          this.connectWebsocket();
        }, this.reconnectDelay);
      } else {
        this.$router.push('/chat-rooms');
      }
    },
    subscribeToTopics() {
      this.stompClient.subscribe(`/ws/topic/${this.roomKeyword}`, (message) => {
        const receivedMsg = JSON.parse(message.body);
        receivedMsg.unreadCount =
          receivedMsg.unreadCount !== undefined ? receivedMsg.unreadCount : 0;
        this.messages.push(receivedMsg);
        this.scrollToBottom();
      });
      this.stompClient.subscribe(
        `/ws/topic/${this.roomKeyword}/read`,
        (message) => {
          const readUpdate = JSON.parse(message.body);
          const targetMsg = this.messages.find(
            (msg) => msg.messageId === readUpdate.messageId,
          );
          if (targetMsg) {
            targetMsg.unreadCount = readUpdate.unreadCount;
          }
        },
      );
      this.stompClient.subscribe(
        `/ws/topic/${this.roomKeyword}/participants`,
        (message) => {
          const participantList = JSON.parse(message.body);
          this.participants = participantList;
        },
      );
    },
    sendMessage() {
      if (this.sending) return;
      this.sending = true;
      const trimmedMessage = this.newMessage.replace(/\n/g, '').trim();
      if (!trimmedMessage) {
        alert('메시지를 입력하세요.');
        this.sending = false;
        return;
      }
      const msgObj = {
        message: trimmedMessage,
        userToken: this.senderToken,
      };
      this.stompClient.send(
        `/ws/publish/${this.roomKeyword}`,
        JSON.stringify(msgObj),
      );
      this.newMessage = '';
      this.sending = false;
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const chatBox = this.$el.querySelector('.chat-box');
        chatBox.scrollTop = chatBox.scrollHeight;
      });
    },
    disconnectWebSocket() {
      if (this.stompClient && this.stompClient.connected) {
        this.stompClient.unsubscribe(`/ws/topic/${this.roomKeyword}`);
        this.stompClient.unsubscribe(`/ws/topic/${this.roomKeyword}/read`);
        this.stompClient.unsubscribe(
          `/ws/topic/${this.roomKeyword}/participants`,
        );
        this.stompClient.disconnect();
      }
      if (this.heartbeatInterval) {
        clearInterval(this.heartbeatInterval);
        this.heartbeatInterval = null;
      }
    },
    startHeartbeat() {
      if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = setInterval(() => {
        if (this.stompClient && this.stompClient.connected) {
          console.log('하트비트: 연결 상태 양호');
        }
      }, this.heartbeatDelay);
    },
    // 사용자 토큰 형식화 함수 (메시지용): JSON 문자열에서 token의 앞 4자리만 추출하여 "GUEST#xxxx" 반환
    formatUserToken(token) {
      try {
        const parsed = typeof token === 'string' ? JSON.parse(token) : token;
        if (parsed && parsed.token) {
          return 'GUEST#' + parsed.token.substring(0, 4);
        }
      } catch (e) {
        return 'GUEST#' + token;
      }
      return 'GUEST#' + token;
    },
    // 참여자 목록에 표시할 사용자 토큰만 추출 (예: "a329")
    formatParticipant(token) {
      try {
        const parsed = typeof token === 'string' ? JSON.parse(token) : token;
        if (parsed && parsed.token) {
          return parsed.token;
        }
      } catch (e) {
        return token;
      }
      return token;
    },
    // 나가기 버튼 클릭 시: DELETE API 호출 후 WS 연결 해제 및 채팅방 목록으로 이동
    leaveChatRoom() {
      axios
        .delete(
          `${process.env.VUE_APP_BASE_URL}/api/v1/chat-rooms/${this.roomKeyword}`,
          {
            headers: { 'X-Session-Id': this.senderToken },
          },
        )
        .then(() => {
          // DELETE 요청 성공 시 WS 연결 해제 후 채팅방 목록으로 리디렉션
          this.disconnectWebSocket();
          this.$router.push('/chat-rooms');
        })
        .catch((error) => {
          console.error('채팅방 나가기 실패:', error);
          alert('채팅방 나가기 실패');
        });
    },
  },
};
</script>

<style scoped>
/* 참여자 목록 카드 */
.participant-card {
  margin-bottom: 16px;
}
.participant-title {
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  padding: 12px;
}

/* 채팅 영역 카드 */
.chat-area-card {
  margin-top: 0;
}

/* 채팅 메시지 영역 */
.chat-box {
  height: 350px; /* 채팅 영역 높이 */
  overflow-y: auto;
  border: 1px solid #ddd;
  padding: 16px;
  background-color: #f9f9f9;
  display: flex;
  flex-direction: column;
  margin-top: 0;
  margin-bottom: 16px;
}

/* 버튼 행: 전송 버튼(8컬럼)과 나가기 버튼(4컬럼) */
.button-row {
  margin-bottom: 8px;
}

/* 메시지 스타일 */
.chat-message {
  margin-bottom: 12px;
  padding: 8px;
  border-radius: 8px;
  max-width: 80%;
}
.sent {
  background-color: #dcf8c6;
  align-self: flex-end;
  text-align: right;
}
.received {
  background-color: #ffffff;
  align-self: flex-start;
  text-align: left;
}
.message-content {
  white-space: pre-wrap;
}
.user-id {
  font-weight: bold;
}
.read-indicator {
  font-size: 0.8em;
  color: #888;
  margin-top: 4px;
  text-align: left;
}
</style>
