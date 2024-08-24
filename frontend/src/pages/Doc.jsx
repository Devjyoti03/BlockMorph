import React, { useContext } from "react";
import { Box, ListItem, Typography, Divider, Button, LinearProgress } from "@mui/material";
import { Code, shadesOfPurple, CopyBlock } from "react-code-blocks";
import { HashLink } from "react-router-hash-link";
import { FaDownload, FaClipboardList } from "react-icons/fa";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { IoLogoJavascript } from "react-icons/io5";
import { FaReact } from "react-icons/fa";
import { styled } from '@mui/system';
import { FaPython } from "react-icons/fa";
import { useState } from "react";
// import axios from 'axios';

// import { collection, doc, getDoc, query, where } from 'firebase/firestore';
// import { db } from '../../config/firebase';
// import { AppContext } from '../../context/AppContext';
// import { instance } from '../../config/axios';

const data = [
  {
    id: 1,
    text: "Initial setup",
    description:
      "Download the ABI from above and paste the files in the frontend folder.",
  },
  {
    id: 2,
    text: "Download dependencies",
  },
  {
    id: 3,
    text: "Custom functions",
  },
];

// const abi = [
//   {
//     inputs: [],
//     stateMutability: "nonpayable",
//     type: "constructor",
//   },
//   {
//     anonymous: false,
//     inputs: [
//       {
//         indexed: true,
//         internalType: "address",
//         name: "user",
//         type: "address",
//       },
//       {
//         indexed: false,
//         internalType: "string",
//         name: "name",
//         type: "string",
//       },
//     ],
//     name: "NameSet",
//     type: "event",
//   },
//   {
//     inputs: [
//       {
//         internalType: "address",
//         name: "_user",
//         type: "address",
//       },
//     ],
//     name: "getUserName",
//     outputs: [
//       {
//         internalType: "string",
//         name: "",
//         type: "string",
//       },
//     ],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [],
//     name: "owner",
//     outputs: [
//       {
//         internalType: "address",
//         name: "",
//         type: "address",
//       },
//     ],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [
//       {
//         internalType: "string",
//         name: "_name",
//         type: "string",
//       },
//     ],
//     name: "setUserName",
//     outputs: [],
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     inputs: [
//       {
//         internalType: "address",
//         name: "",
//         type: "address",
//       },
//     ],
//     name: "userNames",
//     outputs: [
//       {
//         internalType: "string",
//         name: "",
//         type: "string",
//       },
//     ],
//     stateMutability: "view",
//     type: "function",
//   },
// ];

// const solidity_code = `solidity
// pragma solidity ^0.8.0;

// contract Voting {
//     struct Proposal {
//         string name;
//         uint256 upvotes;
//         uint256 downvotes;
//     }

//     mapping(address => mapping(string => bool)) public votes;
//     Proposal[] public proposals;

//     function addProposal(string memory _name) public {
//         proposals.push(Proposal(_name, 0, 0));
//     }

//     function upvote(uint256 _index) public {
//         require(_index < proposals.length, "Invalid proposal index");
//         require(!votes[msg.sender][proposals[_index].name], "Already upvoted");

//         proposals[_index].upvotes++;
//         votes[msg.sender][proposals[_index].name] = true;
//     }

//     function downvote(uint256 _index) public {
//         require(_index < proposals.length, "Invalid proposal index");
//         require(!votes[msg.sender][proposals[_index].name], "Already downvoted");

//         proposals[_index].downvotes++;
//         votes[msg.sender][proposals[_index].name] = true;
//     }

//     function getProposal(uint256 _index) public view returns (string memory, uint256, uint256) {
//         require(_index < proposals.length, "Invalid proposal index");
//         return (proposals[_index].name, proposals[_index].upvotes, proposals[_index].downvotes);
//     }
// }`;



function Doc() {
  const [toggle, setToggle] = useState(0);
  const [selectedFunction, setSelectedFunction] = useState();
  const [functionList, setFunctionList] = useState([]);
  const [contractAddress, setContractAddress] = useState("0x23762183687");
  const [contractName, setContractName] = useState("MyContract");
  const [snippets, setSnippets] = useState([]);
  const [response, setResponse] = useState(JSON.parse(localStorage.getItem("data"))||[]);
  const [languages, setLanguages] = useState([
    "javascript",
    "reactjs",
    "python",
  ]);
  const [loading,setLoading]=useState(true)
  const singleLineSolidityCode = localStorage.getItem("solCode");

  //   const [languageIdx, setLanguageIdx] = useState(0);
  //   const { user } = useContext(AppContext);

  const getResponse = async () => {
    for (let i = 0; i < languages.length; i++) {
      const language = languages[i];

      try {
        const res = await fetch("http://127.0.0.1:5000/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            language: `${language}`,
            code: `${singleLineSolidityCode}`,
          }),
        });

        const data = await res.json();
        console.log(data);

        setResponse((prevResponse) => {
          const newResponse = data;
          return [...prevResponse, newResponse];
        });

        if (i < languages.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      } catch (error) {
        console.error("Error fetching response:", error);
      }
    }
    setLoading(false)
  };

  React.useEffect(() => {
    if (response.length===0) getResponse();
    // if(response.length===3) localStorage.setItem("data",JSON.stringify(response))
  }, []);

  React.useEffect(() => {
    console.log("Response", response)
  }, [response]);

  React.useEffect(() => {
    if (response.length > 0) {
      setFunctionList(response[toggle]?.functions || []);
    }
  }, [toggle, response]);

  React.useEffect(() => {
    if (functionList.length > 0) {
      setSelectedFunction(functionList[0]);
    }
  }, [functionList]);

  React.useEffect(() => {
    if (selectedFunction) {
      const language = languages[toggle];
      let stringOfID3 =
        toggle <= 1
          ? `if (window.ethereum) {
        await window.ethereum.enable();
        `
          : `if w3.isConnected():
        `;
      stringOfID3 += `${toggle === 2 ? "#" : "//"} ${
        selectedFunction?.description
      }
        ${selectedFunction?.[language]}
      ${toggle==2?'':'}'}
        `;
      stringOfID3+=toggle===2?`# ${response[toggle]?.other}`:``;

      const temp = [
        {
          id: 1,
          type: { language },
          text: toggle == 0 ? "Access From Global Window" : "Import",
          code:
            toggle === 0
              ? `const { Contract, ethers, providers } = window.ethers;`
              : toggle === 1
              ? `import { Contract, ethers, providers } from "ethers";`
              : `from web3 import Web3`,
        },
        {
          id: 2,
          type: { language },
          text: "Get signature and smart contract",
          code:
            toggle <= 1
              ? `// Create a provider to connect to the Ethereum network through MetaMask (or another injected provider)
const provider = new providers.Web3Provider(window.ethereum);

// Get the signer (the user's Ethereum account) to sign transactions
const signer = provider.getSigner();

const contract = new Contract(0x23762183687, MyContract.abi, signer);`
              : `# Connect to the Ethereum provider (e.g., MetaMask)
w3 = Web3(Web3.HTTPProvider('http://127.0.0.1:8545'))

# Get the account (signer)
account = w3.eth.account.privateKeyToAccount('<YOUR_PRIVATE_KEY>')

contract = w3.eth.contract(address=${contractAddress}, abi=${contractName}['abi'])`,
        },
        {
          id: 3,
          type: { language },
          text: "Integrate the system",
          code: stringOfID3,
        },
      ];
      setSnippets(temp);
    }
  }, [selectedFunction, toggle]);

  const handleLanguageChange = (index) => {
    if (response.length > 0) {
      const selectedLangFunctions = response[index]?.functions || [];
      setFunctionList(selectedLangFunctions);
    }
  };

  // Trigger the change using this function
  const handleToggleChange = (event, value) => {
    if (value !== null) {
      setToggle(value);
      handleLanguageChange(value);
    }
  };

  //   const handleArtifactDownload = async () => {
  //     setTimeout(() => {
  //       window.open(response?.abiUrl, '_blank', 'noopener,noreferrer');
  //     }, 5000);
  //     return;
  //     axios
  //       .post('http://127.0.0.1:5002/getABI', {
  //         code: code,
  //         contractName: contractName,
  //       })
  //       .then((res) => {
  //         console.log('CID', res.data.CID);
  //         console.log(
  //           'IPFS URL',
  //           `https://gateway.lighthouse.storage/ipfs/${res.data.CID}`
  //         );
  //         window.open(
  //           `https://gateway.lighthouse.storage/ipfs/QmbPWxcRnKq2bQqNPuzq9cTqKCiVAFky6xRN4ZZuD7VRNE`,
  //           '_blank',
  //           'noopener,noreferrer'
  //         );
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   };

  //   React.useEffect(() => {
  //     const fetchData = async () => {
  //       const response = await getDoc(doc(db, 'users', user?.address));
  //       console.log(response.data());
  //       const { urls } = response.data();
  //       setResponse(urls);
  //       setContractName(urls?.contractName);
  //       setContractAddress(response.data().contractAddress);
  //     };
  //     fetchData();
  //   }, [user]);

const StyledListItem = styled(ListItem)(({ theme }) => ({
  // backgroundColor: 'cyan',
  borderRadius: '8px',
  padding: '15px',
  marginBottom: '10px',
  transition: 'all 0.3s ease',
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
  '&:hover': {
    backgroundColor: 'darkblue',
    // backdropFilter: 'blur(20px)',
    boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.2)',

  },
}));

// Styled Typography for text
const StyledTypography = styled(Typography)(({ theme }) => ({
  color: 'white',
  textDecoration: 'none',
  '&:hover': {
    color: "white",
    textDecoration: 'underline',
  },
}));

  if (loading)
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          width: '100vw',
          flexDirection: 'column',
        }}
      >
        <div className="loader">
        <img src="b.svg" alt="Loading" className="loader-image" />
        {/* <h1 className="text-gradient">Blocks Assemble...</h1> */}
      </div>
        <Typography className="text-gradient-2" variant="h4" mb={2} fontWeight={700} align="center">
          Loading The Awesomeness...
        </Typography>
        {/* <LinearProgress sx={{ width: '30%', borderRadius: '2rem', mt: 2 }} /> */}
        
      </Box>
    );
  return (
    <Box 
      display="flex"
      justifyContent="space-between"
      mx="auto"
      height="calc(100vh - 4rem)"
      padding={2}
      sx={{
        '&::-webkit-scrollbar': {
          width: '2px',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'cyan',
          borderRadius: '5px',
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: 'transparent',
        },
        /* Firefox scrollbar styles */
        scrollbarWidth: 'thin',
        scrollbarColor: 'cyan transparent',
        
      }}
    >
      <Box className="gradient-bg-welcome"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
          width: "100%",
          height: "100%",
          borderRadius: "1rem",
          border: "1px solid rgba(255, 255, 255, 0.20)",
          // background: "linear-gradient(180deg, #2B243C 0%, #0B031E 100%)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "20%",
            height: "100%",
            p: 2,
          }}
        >
    {data.map(({ id, text }) => (
  <HashLink
    key={id}
    to={"#" + text.replace(/\s+/g, "-").toLowerCase()}
    className="link-wrapper" // Add a class for additional styling if needed
  >
    <StyledListItem className="gradient-bg-footer">
      <StyledTypography
        variant="body1"
        fontWeight={500}
      >
        {text}
      </StyledTypography>
    </StyledListItem>
  </HashLink>
))}
        </Box>
        <Divider
          orientation="vertical"
          sx={{
            bgcolor: "#EEEEF0",
          }}
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "80%",
            height: "100%",
            p: 2,
            pr: 10,
            ml: 2,
            scrollBehavior: "smooth",
            overflow: "auto",
          }}
        >
          {data.map(({ id, text, description }) => (
            <Box key={id} id={text.replace(/\s+/g, "-").toLowerCase()}>
              <Typography variant="h4" fontWeight={600} mt={1} className="text-gradient">
                {text}
              </Typography>
              <Divider sx={{ mt: 1, mb: 2, bgcolor: "#057b6f" }} />
              <Typography variant="body" fontWeight={500} mt={1}>
                {description}
              </Typography>
              {id === 1 && (
                <Box
                  my={2}
                  sx={{
                    display: "flex",
                    gap: "5px",
                  }}
                >
                  <Button style={{background: "#4391b6"}}
                    variant="contained"
                    startIcon={<FaDownload />}
                    // onClick={() => handleArtifactDownload()}
                  >
                    Download Artifacts
                  </Button>
                  <img src="arrow.svg" alt="------>" />
                  <Button style={{borderBlockColor: "#4391b6", color: "gold"}} variant="outlined" startIcon={<FaClipboardList />}>
                    Copy files to frontend
                  </Button>
                </Box>
              )}
              {id === 2 && (
                <Box
                  my={2}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Typography variant="h5" fontWeight={600} mt={2}>
                    For JavaScript/React JS
                  </Typography>
                  <CopyBlock 
                    className="eth-card"
                    text={"npm install ethers"}
                    language={"shell"}
                    theme={shadesOfPurple}
  //                   theme={{
  //   codeBlock: 'eth-card', // Reference the custom style class
  // }}
                    showLineNumbers={false}
                    customStyle={{
                      padding: "10px",
                      marginTop: "10px",
                    }}
                  />
                  <Typography variant="body" fontWeight={500} mt={2}>
                    {`Note: make sure that `}
                    <Code
                      text={"windows.ether"}
                      language={"env"}
                      theme={shadesOfPurple}
                      showLineNumbers={false}
                    />
                    {` exists in the environment variable `}
                  </Typography>
                  <Typography variant="h5" fontWeight={600} mt={2}>
                    For Python
                  </Typography>
                  <CopyBlock
                    text={"pip install web3"}
                    language={"shell"}
                    theme={shadesOfPurple}
                    showLineNumbers={false}
                    customStyle={{
                      padding: "10px",
                      marginTop: "10px",
                    }}
                  />
                </Box>
              )}
              {id === 3 && (
                <Box
                  my={2}
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid #2E3C51",
                    borderRadius: "0.5rem",
                    p: "0.5rem",
                    gap: "0.5rem",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      width: "30%",
                      borderRadius: "0.5rem",
                      background: "rgba(255, 255, 255, 0.10)",
                      p: "0.5rem",
                    }}
                  >
                    <Typography variant="body" fontWeight={600} my={1} ml={1}>
                      Function Names
                    </Typography>
                    <Divider sx={{ mt: 1 }} />
                    {functionList.map((func, index) => (
                      <ListItem
                        key={index}
                        sx={{
                          color:
                            selectedFunction === func ? "white" : "#EEEEF0",
                          fontWeight: selectedFunction === func ? "600" : "400",
                          cursor: "pointer",
                        }}
                        onClick={() => setSelectedFunction(func)}
                      >
                        {`${func.name}()`}
                      </ListItem>
                    ))}
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      width: "100%",
                      borderRadius: "0.5rem",
                      p: "0.5rem",
                      background: "rgba(255, 255, 255, 0.10)",
                    }}
                  >
                    <ToggleButtonGroup
                      value={toggle}
                      exclusive
                      onChange={handleToggleChange}
                      size="small"
                      sx={{ color: "white" }}
                    >
                      <ToggleButton value={0}>
                        <IoLogoJavascript style={{ marginRight: "0.3rem" }} />
                        Javascript
                      </ToggleButton>
                      <ToggleButton value={1}>
                        <FaReact style={{ marginRight: "0.3rem" }} />
                        React
                      </ToggleButton>
                      <ToggleButton value={2}>
                        <FaPython style={{ marginRight: "0.3rem" }} />
                        Python
                      </ToggleButton>
                    </ToggleButtonGroup>

                    <Divider sx={{ mt: 1 }} />
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        padding: "0.5rem",
                      }}
                    >
                      {snippets.map(({ id, text, code }) => (
                        <Box key={id} mb={3}>
                          <Typography variant="body" fontWeight={600}>
                            {text}
                          </Typography>
                          <CopyBlock
                            text={code}
                            language={toggle === 2 ? "py" : "jsx"}
                            theme={shadesOfPurple}
                            showLineNumbers={false}
                            wrapLongLines
                            customStyle={{
                              padding: "10px",
                              marginTop: "10px",
                            }}
                          />
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

export default Doc;
