import { useState } from "react";
import FormInput from '../form-input/form-input.component'
import './sign-up-form.styles.scss'
import Button from '../button/button.component'
import {
  createAuthUserWithEmailAndPassword,
  createUserDocumentFromAuth,
} from "../../utils/firebase/firebase.utils";

const defaultFormFields = {
  displayName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const SignUpForm = () => {
  const [formFields, setFormFields] = useState(defaultFormFields);
  const { displayName, email, password, confirmPassword } = formFields;

  console.log(formFields);

  const resetFormFields = () => {
    setFormFields(defaultFormFields)
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      alert("ваши пароли не совпадают");
    }

    try {
      const { user } = await createAuthUserWithEmailAndPassword(
        email,
        password
      );

      await createUserDocumentFromAuth(user, { displayName });
      resetFormFields()
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        alert(
          "невозможно создать пользователя с уже используемой электоронной почтой"
        );
      } else {
        console.log("user creation encountered an error", error);
      }
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormFields({ ...formFields, [name]: value });
  };

  return (
    <div className='sign-up-container'>
      <h2>У вас нет аккаунта?</h2>
      <span>Зарегистрируйтесь указав свотй email и пороль</span>
      <form onSubmit={handleSubmit}>
        <FormInput
          label='Ваше имя'
          type="text"
          required
          onChange={handleChange}
          name="displayName"
          value={displayName}
        />

        <FormInput
          label='Электоронная почта'
          type="email"
          required
          onChange={handleChange}
          name="email"
          value={email}
        />

        <FormInput
          label='Пароль'
          type="password"
          required
          onChange={handleChange}
          name="password"
          value={password}
        />

        <FormInput
          label='Подтверждение пароля'
          type="password"
          required
          onChange={handleChange}
          name="confirmPassword"
          value={confirmPassword}
        />

        <Button type="submit">Зарегистрироваться</Button>
      </form>
    </div>
  );
};

export default SignUpForm;
