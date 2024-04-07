import {
  WalletAdapterNetwork,
  WalletNotConnectedError,
} from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
  useWallet,
} from "@solana/wallet-adapter-react";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import ReactDOM from "react-dom";

import {
  clusterApiUrl,
  Connection,
  PublicKey,
} from "@solana/web3.js";
import { FC, ReactNode, useMemo, useCallback } from "react";

import { Metadata } from "@metaplex-foundation/mpl-token-metadata";

import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
require("./App.css");
require("@solana/wallet-adapter-react-ui/styles.css");

let tokensInWallet: any = [];

const App: FC = () => {
  return (
    <Context>
      <Content />
    </Context>
  );
};
export default App;

const Context: FC<{ children: ReactNode }> = ({ children }) => {
  const network = WalletAdapterNetwork.Mainnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(() => [new PhantomWalletAdapter()], [network]);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

const Content: FC = () => {
  const connection = new Connection("https://api.mainnet-beta.solana.com");

  async function getTheTokensOfOwner(MY_WALLET_ADDRESS: string) {
    (async () => {
      const connection = new Connection(
        clusterApiUrl("mainnet-beta"),
        "confirmed"
      );

      const accounts = await connection.getParsedProgramAccounts(
        TOKEN_PROGRAM_ID,
        {
          filters: [
            {
              dataSize: 165,
            },
            {
              memcmp: {
                offset: 32,
                bytes: MY_WALLET_ADDRESS,
              },
            },
          ],
        }
      );

      let totalNFTsI = 0;
      accounts.forEach((account, i) => {
        let amountI =
          account.account.data["parsed"]["info"]["tokenAmount"]["uiAmount"];
        let mint_s = account.account.data["parsed"]["info"]["mint"];

        if (amountI == 1) {
          totalNFTsI += 1;

          try {
            let objT: any = {};
            objT.mint = mint_s;
            objT.amount = amountI;
            tokensInWallet.push(objT);
          } catch {}
        }
      });

   

      let nfts_total_element = <span>({totalNFTsI})</span>;

      ReactDOM.render(nfts_total_element, document.getElementById("totalNFTs"));

    
      let currentI = 0;
      await tokensInWallet.forEach((element) => {
        console.log("element[currentI].mint" + element.mint);
        getAccountMetaData(element.mint, element.amount, currentI);
        currentI += 1;
      });
    })();
  }
  let elements: any = [];

  async function UpdateTheUI(tokenInWallet, number) {
    return fetch(tokenInWallet.uri)
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson.image);
        let element = <img src={responseJson.image} width="100%" />;
        let elementname = <h1>{tokenInWallet.name}</h1>;

        ReactDOM.render(
          element,
          document.getElementById("img" + number.toString())
        );
        ReactDOM.render(
          elementname,
          document.getElementById("tit" + number.toString())
        );

        elements.push(element);

        return responseJson.image;
      })
      .catch((error) => {
        console.error(error);
      });
  }

  async function getAccountMetaData(mintAddress, amountI, numberI) {
    (async () => {
      let mintPubkey = new PublicKey(mintAddress);
      let tokenmetaPubkey = await Metadata.getPDA(mintPubkey);

      const tokenmeta: any = await Metadata.load(connection, tokenmetaPubkey);
      tokensInWallet[numberI].name = tokenmeta.data.data["name"];
      tokensInWallet[numberI].uri = tokenmeta.data.data["uri"];
      await UpdateTheUI(tokensInWallet[numberI], numberI);
    })();
  }

  const { publicKey, sendTransaction } = useWallet();

  const onClick = useCallback(async () => {
    if (!publicKey) throw new WalletNotConnectedError();
    connection.getBalance(publicKey).then((bal) => {
    });

    getTheTokensOfOwner(publicKey.toBase58());
  }, [publicKey, sendTransaction, connection]);

  return (
    <div className="navbar">
      <div className="navbar-inner">
        <h1 className="text-white">Internship Assingnment for SpendWise</h1>
        <ul className="nav pull-right">
          <WalletMultiButton />
        </ul>
      </div>
      <div className="container-fluid" id="nfts">
        <button onClick={onClick}>get NFTs</button>
        <br></br>{" "}
        <h1>
          NFTs in wallet <span id="totalNFTs"></span>
        </h1>
        <div className="row-fluid">
          <div className="span4">
            <ul className="thumbnails">
              <p id="tit0"></p>

              <li className="span10">
                <div id="img0" className="thumbnail0"></div>
              </li>
            </ul>
          </div>

          <div className="span4">
            <ul className="thumbnails">
              <p id="tit1"></p>

              <li className="span10">
                <div id="img1" className="thumbnail0"></div>
              </li>
            </ul>
          </div>

          <div className="span4">
            <ul className="thumbnails">
              <p id="tit2"></p>

              <li className="span10">
                <div id="img2" className="thumbnail0"></div>
              </li>
            </ul>
          </div>
        </div>
        <div className="row-fluid">
          <div className="span4">
            <ul className="thumbnails">
              <p id="tit3"></p>

              <li className="span10">
                <div id="img3" className="thumbnail0"></div>
              </li>
            </ul>
          </div>

          <div className="span4">
            <ul className="thumbnails">
              <p id="tit4"></p>

              <li className="span10">
                <div id="img4" className="thumbnail0"></div>
              </li>
            </ul>
          </div>

          <div className="span4">
            <ul className="thumbnails">
              <p id="tit5"></p>

              <li className="span10">
                <div id="img5" className="thumbnail0"></div>
              </li>
            </ul>
          </div>
        </div>
        <div className="row-fluid">
          <div className="span4">
            <ul className="thumbnails">
              <p id="tit6"></p>

              <li className="span10">
                <div id="img6" className="thumbnail0"></div>
              </li>
            </ul>
          </div>

          <div className="span4">
            <ul className="thumbnails">
              <p id="tit7"></p>

              <li className="span10">
                <div id="img7" className="thumbnail0"></div>
              </li>
            </ul>
          </div>

          <div className="span4">
            <ul className="thumbnails">
              <p id="tit8"></p>

              <li className="span10">
                <div id="img8" className="thumbnail0"></div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
