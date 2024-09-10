import { Ref, ref } from 'vue';

type UseTogglerRes = [Ref<boolean>, (any) => void];

const useToggler = (initialValue = false): UseTogglerRes => {
  const state = ref(initialValue);

  const toggle = () => {
    state.value = !state.value;
  };

  return [state, toggle];
};

export default useToggler;
