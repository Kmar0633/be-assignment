
# Be-Assignment

My Implementation of Be-Assignment App

## Set Up

To run this app, you need to run

```
  npm run dev
```

## API Reference

#### Sign up

```http
  POST /be-assignment/v1/accounts/signup
```

| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `username` | `string` | **Required**. Your username |
| `password` | `string` | **Required**. Your password |



#### Login Account

```http
  POST /be-assignment/v1/accounts/login
```

| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `username` | `string` | **Required**. Your username |
| `password` | `string` | **Required**. Your password |


#### Fetching all accounts and transactions of a user

```http
  GET /be-assignment/v1/accounts/:username/payment-accounts
```

| Header | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `x-auth-token` | `string` | **Required**. Your token that you get after logging in |


| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `username` | `string` | **Required**. Your Username |


#### Withdrawing Money from user account

```http
  POST /be-assignment/v1/payments/withdraw
```

| Header | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `x-auth-token` | `string` | **Required**. Your token that you get after logging in |


| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `amount` | `float` | **Required**. The Amount of money you want to withdraw |
| `toAddress` | `Integer` | **Required**. The account id that you want to withdraw money from |
| `currency` | `string` | **Required**. Your currency of the money |

#### Depositing Money into user account

```http
  POST /be-assignment/v1/payments/send
```

| Header | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `x-auth-token` | `string` | **Required**. Your token that you get after logging in |


| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `amount` | `float` | **Required**. Your amount of money you want to deposit |
| `toAddress` | `Integer` | **Required**. The account id that you want to deposit money into |
| `currency` | `string` | **Required**. Your currency of the money |