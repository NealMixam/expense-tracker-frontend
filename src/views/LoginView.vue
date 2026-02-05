<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';
import Message from 'primevue/message';

const authStore = useAuthStore();
const isLogin = ref(true);
const username = ref('');
const password = ref('');
const error = ref('');

const submit = async () => {
    error.value = '';
    try {
        if (isLogin.value) {
            await authStore.login(username.value, password.value);
        } else {
            await authStore.register(username.value, password.value);
        }
    } catch (e) {
        error.value = e;
    }
};
</script>

<template>
    <div class="flex-center">
        <Card style="width: 25rem; overflow: hidden">
            <template #title>{{ isLogin ? 'Вход' : 'Регистрация' }}</template>
            <template #content>
                <div class="flex flex-col gap-4">
                    <div class="flex flex-col gap-2">
                        <label for="username">Имя пользователя</label>
                        <InputText id="username" v-model="username" />
                    </div>
                    <div class="flex flex-col gap-2">
                        <label for="password">Пароль</label>
                        <Password id="password" v-model="password" :feedback="false" toggleMask fluid />
                    </div>
                    <Message v-if="error" severity="error">{{ error }}</Message>
                </div>
            </template>
            <template #footer>
                <div class="flex gap-4 mt-1">
                    <Button :label="isLogin ? 'Войти' : 'Создать аккаунт'" class="w-full" @click="submit" />
                    <Button :label="isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'" link class="w-full"
                        @click="isLogin = !isLogin; error = ''" />
                </div>
            </template>
        </Card>
    </div>
</template>

<style scoped>
.flex-center {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f4f4f9;
}

.flex-col {
    display: flex;
    flex-direction: column;
}

.gap-4 {
    gap: 1rem;
}

.gap-2 {
    gap: 0.5rem;
}

.w-full {
    width: 100%;
}
</style>