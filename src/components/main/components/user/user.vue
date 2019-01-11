<template>
  <div class="user-avator-dropdown">
    <Dropdown @on-click="handleClick">
      <Badge :dot="!!messageUnreadCount">
        <Avatar :src="userAvator"/>
      </Badge>
      <Icon :size="18" type="md-arrow-dropdown"></Icon>
      <DropdownMenu slot="list">
        <DropdownItem name="message">
          消息中心<Badge style="margin-left: 10px" :count="messageUnreadCount"></Badge>
        </DropdownItem>
        <DropdownItem name="updatePassword">修改密码</DropdownItem>
        <DropdownItem name="logout">退出登录</DropdownItem>
      </DropdownMenu>
    </Dropdown>
    <Modal
      v-model="modal"
      title="修改密码"
      @on-ok="updatePassword"
      >
      <Form :model="formItem" >
        <FormItem label="旧密码">
          <Input type='password' v-model="formItem.oldPassword" placeholder="请输入旧密码"></Input>
        </FormItem>
        <FormItem label="新密码">
          <Input type='password' v-model="formItem.newPassword" placeholder="请输入新密码"></Input>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import './user.less'
import { mapActions } from 'vuex'
import { updatePassword } from '@/api/handleUser'
export default {
  name: 'User',
  props: {
    userAvator: {
      type: String,
      default: ''
    },
    messageUnreadCount: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      modal: false,
      formItem: {
        oldPassword: '',
        newPassword: '',
        user_id: this.$store.state.user.userId
      }
    }
  },
  methods: {
    ...mapActions([
      'handleLogOut'
    ]),
    logout () {
      this.handleLogOut().then(() => {
        this.$router.push({
          name: 'login'
        })
      })
    },
    message () {
      this.$router.push({
        name: 'message_page'
      })
    },
    updatePassword () {
      updatePassword(this.formItem).then(res => {
        if (res.data.status === 500) {
          this.$Message.error('修改失败，请确保旧密码正确')
        } else {
          this.$Message.success('修改密码成功')
          this.formItem.oldPassword = ''
          this.formItem.newPassword = ''
        }
      })
    },
    showModal () {
      this.modal = true
    },
    handleClick (name) {
      switch (name) {
        case 'logout': this.logout()
          break
        case 'message': this.message()
          break
        case 'updatePassword':this.showModal()
      }
    }
  }
}
</script>
