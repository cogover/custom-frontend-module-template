import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AccountType } from 'src/apis/management-account/management-account.type';

export interface AccountTypeState {
    detailAccount: AccountType;
}

const initialState: AccountTypeState = {
    detailAccount: {} as AccountType,
};

export const slice = createSlice({
    name: 'managementAccount',
    initialState,
    reducers: {
        setDetailAccount: (state, action: PayloadAction<AccountType>) => {
            state.detailAccount = action.payload;
        },
    },
});

export const { setDetailAccount } = slice.actions;
export default slice.reducer;
