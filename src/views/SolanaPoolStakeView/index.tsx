import { FC, useState } from "react";
import { SendTransactionRequest, useTonConnectUI } from "@tonconnect/ui-react";
import { useTonAddress } from "@tonconnect/ui-react";
import { useUserStore } from "store/userStore";
import { apiRaffles } from "api/raffles";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { InputAdornment, OutlinedInput } from "@mui/material";
import CardInfoToken from "components/CardInfoToken";
import Header from "components/Header";

export const SolanaPoolStakeView: FC = ({}) => {
  const userFriendlyAddress = useTonAddress();

  return (
    <div className="container mx-auto p-8 2xl:px-0 overflow-x-hidden overflow-y-auto">
      <div>
        <Header></Header>

        <div className="flex justify-center">
          {userFriendlyAddress && <StakingScreen />}
        </div>
      </div>
    </div>
  );
};

const StakingScreen = () => {
  return (
    <div className="rounded-lg flex justify-center w-full overflow-x-hidden">
      <div className="flex flex-col w-full flex-1 items-center justify-center">
        <div className="flex flex-1 w-full">
          <NetStaking />
        </div>
      </div>
    </div>
  );
};

type NetStaking = {
  // onSwapSent: (t: any) => void;
};

const NetStaking: FC<NetStaking> = ({}) => {
  const [age, setAge] = useState("");
  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value);
  };

  return (
    <div style={{ minWidth: 240 }} className="flex flex-1 flex-col gap-5 mt-6">
      <div className="flex flex-1 gap-3">
        <FormControl className="flex flex-1" fullWidth sx={{ m: 1 }}>
          <InputLabel htmlFor="outlined-adornment-amount">Search</InputLabel>
          <OutlinedInput
            id="outlined-adornment-amount"
            startAdornment={
              <InputAdornment position="start">Search</InputAdornment>
            }
            label="Amount"
          />
        </FormControl>
        <FormControl sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="demo-simple-select-helper-label">Filter</InputLabel>
          <Select
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
            value={age}
            label="Age"
            onChange={handleChange}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="demo-simple-select-helper-label">Sort By</InputLabel>
          <Select
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
            value={age}
            label="Age"
            onChange={handleChange}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </Select>
        </FormControl>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <CardInfoToken></CardInfoToken>
        <CardInfoToken></CardInfoToken>
        <CardInfoToken></CardInfoToken>
      </div>
    </div>
  );
};
