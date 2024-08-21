import { RouterProvider } from "react-router-dom";
import router from "./config/router";
import StyleThemeProvider from "./theme/ThemeProvider";
import { SnackbarProvider } from "notistack";
import { Context } from "./context/Context";

// const appID = 'xar_test_fe9df73ff0f3ca7b5300b27720265695728c1d82';

// export const arcanaProvider = new AuthProvider(appID, {
// 	network: "testnet", //defaults to 'testnet'
// 	position: "right", //defaults to right
// 	theme: "light", //defaults to dark
// 	alwaysVisible: true, //defaults to true which is Full UI mode
// 	chainConfig: {
// 		chainId: 80001, //defaults to CHAIN.ETHEREUM_MAINNET
// 		rpcUrl: "https://polygon-rpc.com", //defaults to 'https://rpc.ankr.com/eth'
// 	},
// });

function App() {
  return (
    <>
      <Context.Provider value={true}>
        <StyleThemeProvider>
          <SnackbarProvider maxSnack={3} autoHideDuration={5000}>
            <RouterProvider router={router} />
          </SnackbarProvider>
        </StyleThemeProvider>
      </Context.Provider>
      {/* </AppContext.Provider> */}
      {/* </ProvideAuth> */}
    </>
  );
}

export default App;
