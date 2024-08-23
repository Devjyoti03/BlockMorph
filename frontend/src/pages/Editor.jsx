import {
  Box,
  Button,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
  Divider,
} from "@mui/material";
import GradientButton from "../components/GradientButton";
import Editor from "@monaco-editor/react";
import { GrDeploy } from "react-icons/gr";
import { FaMagic } from "react-icons/fa";
import { LuHardHat, LuSplitSquareHorizontal } from "react-icons/lu";
import LightButton from "../components/LightButton";
import YellowButton from "../components/YellowButton";
import { FaCode, FaDownload } from "react-icons/fa";
import { MdArrowForwardIos } from "react-icons/md";
import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
// import { instance } from "../../config/axios";
import { encode } from "base-64";
import axios from "axios";
// import { db } from "../../config/firebase";
// import { AppContext } from "../../context/AppContext";
import { Context } from "../context/Context";
// import { doc, updateDoc } from "firebase/firestore";
import Modal from "@mui/material/Modal";
import CustomizedDialogs from "../components/LegacyDialog";
import { GoogleGenerativeAI } from "@google/generative-ai";
import instance from "../config/axiosInstance";

const tempSteps = [
  {
    id: "01",
    text: "Open Remix IDE",
  },
  {
    id: "02",
    text: 'Click "+" in the file explorer, name the file according to contract name(e.g., Contract.sol).',
  },
  {
    id: "03",
    text: "Copy contract code, paste into the new file.",
  },
  {
    id: "04",
    text: 'Go to "Solidity" tab, select compiler version, click "Compile".',
  },
  {
    id: "05",
    text: 'Switch to "Deploy & Run Transactions" tab, click "Deploy".',
  },
  {
    id: "06",
    text: "Find deployed contract, expand, interact with functions",
  },
  {
    id: "07",
    text: 'Deploy contract, set value using a setter function in "Deployed Contracts" with entered parameter',
  },
  {
    id: "08",
    text: "Get value using a getter function in 'Deployed Contracts'",
  },
  {
    id: "09",
    text: 'In "Events" section, observe emitted events.',
  },
  {
    id: "10",
    text: "If present, test modifiers like onlyOwner.",
  },
];

function EditorPage() {
  // const { user } = useContext(AppContext);
  const { state } = useLocation();
  //const { selectedOption, url } = state;
  const [inputQuestions, setInputQuestions] = useState("");
  const [code, setCode] = useState("");
  const [summary, setSummary] = useState("");
  const [tabsLayout, setTabsLayout] = useState([25, 45, 30]);
  const [isDisabled, setIsDisabled] = useState(true);
  const [contractName, setContractName] = useState("");
  const isTest = React.useContext(Context);
  const [ABI, setABI] = useState();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contractAdd, setContractAdd] = useState();
  const [currentStep, setCurrentStep] = useState(0);

  //For Generate Sol Code
  const { idea } = useParams();
  const [additionalFeatures, setAdditionalFeatures] = useState("");
  const [solidityCode, setSolidityCode] = useState("");
  console.log(idea);

  // console.log(selectedOption);
  const onTabClick = async () => {
    try {
      const genAI = new GoogleGenerativeAI(
        "AIzaSyD4UE6-0QdB1QCtxXE-1k7EQv-3VHQJP1Q"
      );
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const basePrompt = `Generate Solidity code for a smart contract based on the following Web3 idea: ${idea}.  Do not include any explanations, comments, or markdown formatting—only return the raw Solidity code. The code should be error-free and optimized.`;
      const prompt = `${basePrompt} Features to implement: ${inputQuestions}. Additional features: ${additionalFeatures}.  `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      let generatedCode = await response.text();
      generatedCode = "// SPDX-License-Identifier: MIT\n" + generatedCode;
      setSolidityCode(generatedCode);

      setCode(generatedCode);

      // Prompt to generate a summary of the generated Solidity code
      const summaryPrompt = `Summarize the key features and functions of the following Solidity smart contract code in a concise manner. Code: ${generatedCode}`;
      const summaryResult = await model.generateContent(summaryPrompt);
      const summaryResponse = await summaryResult.response;
      const generatedSummary = await summaryResponse.text();

      setSummary(generatedSummary);
      setContractName("YourContractName");

      if (tabsLayout[0] === 25) {
        setTabsLayout([5, 65, 30]);
        setIsDisabled(false);
      } else if (tabsLayout[0] === 5) {
        setTabsLayout([25, 45, 30]);
        setIsDisabled(true);
      }
    } catch (error) {
      console.error("Error generating Solidity code: ", error);
    }
  };
  console.log(code);

  /*const  deployContract = () => {
    console.log(code); // Print the editor value
    // Deploy contract Codee... Time lagbe korte
  };*/
  const deployContract = () => {
    console.log(code);
  };

  // const handleDownloadHardhat = async () => {
  //   setCurrentStep(0);
  //   try {
  //     setLoading(true);
  //     await new Promise((resolve) => setTimeout(resolve, 4000));
  //     setCurrentStep(1);
  //     const response = await axios.post(
  //       !isTest
  //         ? "https://49c4-2409-40f2-18-f350-f485-a4b8-b5b3-ae50.ngrok-free.app"
  //         : "https://ethflask-fea7.onrender.com" + "/generateabi",
  //       {
  //         code: code,
  //         testing: "",
  //         contractName: contractName,
  //         is_test: isTest,
  //       }
  //     );
  //     setCurrentStep(2);
  //     await new Promise((resolve) => setTimeout(resolve, 3000));
  //     setCurrentStep(3);
  //     setABI(response?.data?.ABI);
  //     await updateDoc(doc(db, "users", user?.address), {
  //       urls: {
  //         url: state?.url,
  //         abi: response?.data?.ABI,
  //         abiUrl: response?.data?.ABI_URI,
  //         hardhatUrl: response?.data?.HardHat,
  //         contractName: response.data.ABI.contractName,
  //       },
  //     });

  //     await new Promise((resolve) => setTimeout(resolve, 6000));
  //     setCurrentStep(4);
  //     await new Promise((resolve) => setTimeout(resolve, 1000));
  //     window.open(response?.data?.HardHat, "_blank", "noopener,noreferrer");
  //     setLoading(false);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // const onTabClick = async () => {
  //   try {
  //     const response = await instance.post("generate/code", {
  //       approach_heading: state?.selectedOption?.heading,
  //       approach_content: state?.selectedOption?.content,
  //       user_approach: inputQuestions,
  //       is_test: isTest,
  //     });
  //     console.log(response?.data?.response);
  //     setContractName(response?.data?.response?.contract_name);
  //     setCode("//" + response?.data?.response?.solidity_code);
  //     setSummary(response?.data?.response?.details?.additional_notes);
  //     updateDoc(doc(db, "users", user.address), {
  //       snippet: {
  //         approach_heading: state?.selectedOption?.heading,
  //         approach_content: state?.selectedOption?.content,
  //         user_approach: inputQuestions,
  //         solidity_code: response?.data?.response?.solidity_code,
  //         details: response?.data?.response?.details?.additional_notes,
  //       },
  //     });
  //     if (tabsLayout[0] === 25) {
  //       setTabsLayout([5, 65, 30]);
  //       setIsDisabled(false);
  //     } else if (tabsLayout[0] === 5) {
  //       setTabsLayout([25, 45, 30]);
  //       setIsDisabled(true);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // const deployContract = async () => {
  //   try {
  //     const response = await axios.post(
  //         "https://magic-deploy.onrender.com/deploy-contract",
  //       {
  //         rpc: "https://rpc.public.zkevm-test.net",
  //         bytecode: ABI?.bytecode,
  //         abi: ABI?.abi,
  //         is_test: isTest,
  //       },
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );
  //     console.log("deploy", response?.data);
  //     setContractAdd(response?.data?.contractAddress);
  //     await updateDoc(doc(db, "users", user?.address), {
  //       contractAddress: response?.data?.contractAddress,
  //     });
  //     setIsModalOpen(true);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // useEffect(() => {
  //   localStorage.setItem("code", code);
  //   localStorage.setItem("contractName", contractName);
  // }, [code, contractName]);

  // const handleModalClose = () => {
  //   setIsModalOpen(false);
  //   window.location.href = "/doc";
  // };

  async function handleDownloadHardhat() {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const userAddress = accounts[0]; // MetaMask address
      console.log(userAddress);
      const { data } = await instance.post("/process_link", {
        solCode: solidityCode,
        meta_id: `project${userAddress}`,
      });

      if (data.success) {
        alert("Brownie Project Initiated");
        // Step 2: Trigger compilation process
        const compileResponse = await instance
          .post(
            "/compile",
            {
              contract_name: "contract.sol",
              meta_acc: `project${userAddress}`,
            },
            {
              responseType: "application/json", // Important to handle binary data
            }
          )
          .then((data) => {
            alert("compiled successfully, baby!");
          });

        // Step 3: Save the zip file
        // const blob = new Blob([compileResponse.data], {
        //   type: "application/zip",
        // });
        // saveAs(blob, `${user_id}.zip`);
      }
    } catch (err) {
      console.error(err);
      alert("error", err);
    }
  }

  return (
    <>
      <Box
        sx={{
          height: "calc(100vh - 4rem)",
          width: "100vw",
          padding: "1rem",
          margin: "auto",
          display: "flex",
        }}
      >
        <Box
          className="gradient-bg-editor"
          sx={{
            borderRadius: 2,
            border: "1px solid rgba(255, 255, 255, 0.20)",
            // background: "linear-gradient(180deg, #2B243C 0%, #0B031E 100%)",
            width: "100%",
            display: "flex",
            justifyContent: "space-evenly",
            alignItems: "stretch",
            height: "100%",
            padding: "0.5rem",
          }}
        >
          <Box
            width={tabsLayout[0] + "%"}
            height="100%"
            display="flex"
            justifyContent="space-evenly"
            alignItems="stretch"
            flexDirection="column"
            sx={{
              transition: "all 0.3s ease",
            }}
          >
            <Box
              sx={{
                borderRadius: 1,
                border: "1px solid #EEEEF0",
                background: "rgba(255, 255, 255, 0.10)",
                p: 2,
                height: "100%",
              }}
            >
              {tabsLayout[0] === 25 && (
                <>
                  <Typography fontSize={18} fontWeight="600">
                    Approach Selected
                  </Typography>
                  <Typography fontSize={13}>
                    {decodeURIComponent(idea)}
                    {/* {selectedOption} */}
                  </Typography>
                </>
              )}
            </Box>
            <Box
              sx={{
                mt: 1,
                borderRadius: 1,
                border: "1px solid #2E3C51",
                background: "rgba(255, 255, 255, 0.05)",
                height: "100%",
                p: 2,
              }}
            >
              {tabsLayout[0] === 25 && (
                <Box height="80%">
                  <Typography variant="body" fontWeight={600} align="center">
                    What features do you want your smart contract to implement?
                  </Typography>
                  <Box height="140px" mt={1}>
                    <TextField
                      placeholder="Enter here..."
                      fullWidth
                      multiline
                      minRows={6}
                      onChange={(e) => setInputQuestions(e.target.value)}
                      value={inputQuestions}
                      sx={{
                        height: "100%",
                        overflow: "auto",
                        background: "rgba(255, 255, 255, 0.10)",
                        borderRadius: 1,
                      }}
                    />
                  </Box>
                </Box>
              )}
            </Box>
            {tabsLayout[0] === 25 ? (
              <Box mt={1}>
                <GradientButton
                  onClick={onTabClick}
                  text="Generate Code"
                  icon={<FaMagic />}
                  fullWidth
                  styles={{
                    borderRadius: 1,
                  }}
                />
              </Box>
            ) : (
              <Box mt={1}>
                <Button
                  // onClick={onTabClick}
                  sx={{
                    borderRadius: 1,
                    background: `var(--brand-mix, conic-gradient(
                from 180deg at 50% 50%,
                #b52bba 4.666563235223293deg,
                #a12cbc 23.647727966308594deg,
                #8c2ebe 44.85525995492935deg,
                #792fbf 72.45651304721832deg,
                #6c30c0 82.50000178813934deg,
                #4b32c3 127.99007892608643deg,
                #5831c2 160.968976020813deg,
                #6330c1 178.45529437065125deg,
                #742fc0 189.47770357131958deg,
                #8d2dbe 202.95226335525513deg,
                #a62cbc 230.65982580184937deg,
                #b92aba 251.35178089141846deg,
                #d029b8 276.4414644241333deg,
                #ec27b6 306.45145654678345deg,
                #c729b9 331.67617321014404deg
              )
            )`,
                    boxShadow: "0px 0px 60px 0px rgba(236, 39, 182, 0.6)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "1rem",
                    width: "100%",
                    height: "100%",
                    // add on hover
                  }}
                >
                  <MdArrowForwardIos color="#fff" />
                </Button>
              </Box>
            )}
          </Box>
          <Divider
            orientation="vertical"
            sx={{
              ml: 1,
              bgcolor: "white",
            }}
          />
          <Box
            width={tabsLayout[1] + "%"}
            height="100%"
            display="flex"
            justifyContent="center"
            alignItems="stretch"
            flexDirection="column"
            px={1}
            sx={{
              transition: "all 0.3s ease",
            }}
          >
            <Box
              sx={{
                flex: 1,
                borderRadius: 1,
                border: "1px solid #EEEEF0",
                background: "#1D172B",
                mb: 1,
                height: "100%",
                overflow: "hidden",
              }}
            >
              <Editor
                height="100%"
                defaultLanguage="sol"
                value={code || "// Code goes here"}
                theme="vs-dark"
                onChange={(value) => setCode(value)}
              />
            </Box>
            <Box
              display="flex"
              justifyContent="space-evenly"
              alignItems="stretch"
              sx={{
                gap: 1,
              }}
            >
              <YellowButton
                text={loading ? "Loading...." : "Slither Check"}
                fullWidth
                isDisabled={isDisabled}
                icon={<LuSplitSquareHorizontal color="black" />}
                // onClick={() => checkSlitherVul()}
              />
              <YellowButton
                text={loading ? "Loading...." : "Get Brownie"}
                fullWidth
                isDisabled={isDisabled}
                icon={<LuHardHat color="black" />}
                onClick={() => handleDownloadHardhat()}
              />
            </Box>
          </Box>
          <Box
            width={tabsLayout[2] + "%"}
            display="flex"
            justifyContent="center"
            alignItems="stretch"
            flexDirection="column"
            height="100%"
          >
            <Box
              sx={{
                borderRadius: 1,
                border: "1px solid #2E3C51",
                background: "rgba(255, 255, 255, 0.05)",
                height: "20rem",
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                pt: 2,
              }}
            >
              <Typography fontSize={18} fontWeight="600" align="center">
                Steps to test it on RemixIDE
              </Typography>
              <Box
                px={2}
                pt={2}
                pb={5}
                display="flex"
                flexDirection="column"
                height="100%"
                justifyContent="space-between"
              >
                <Stepper
                  activeStep={-1}
                  orientation="vertical"
                  sx={{
                    color: "white",
                    overflow: "auto",
                  }}
                >
                  {tempSteps.map(({ id, text }) => {
                    return (
                      <Step key={id}>
                        <StepLabel color="white">
                          <Box color="white">{text}</Box>
                        </StepLabel>
                      </Step>
                    );
                  })}
                </Stepper>
                <LightButton
                  component={Link}
                  to={`https://remix.ethereum.org/?#code=${encode(
                    code
                  )}&autoCompile=true`}
                  target="_blank"
                  text="Open in Remix IDE"
                  icon={<FaCode />}
                  fullWidth
                />
              </Box>
            </Box>
            <Box
              my={1}
              sx={{
                borderRadius: 1,
                border: "1px solid #EEEEF0",
                background: "rgba(255, 255, 255, 0.10)",
                p: 2,
                height: "calc(100% - 20rem)",
                overflow: "auto",
              }}
            >
              <Typography fontSize={18} fontWeight="600">
                Contract Summary
              </Typography>
              <Typography fontSize={13}>
                {summary ||
                  "Generated Solidity contract based on provided features and additional requirements."}
              </Typography>
              <Typography fontSize={13}>
                {summary ||
                  "Generated Solidity contract based on provided features and additional requirements.lorem ipsum kebla bhabla"}
              </Typography>
            </Box>
            <Modal
              open={isModalOpen}
              // onClose={handleModalClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
              sx={{
                "& > .MuiBackdrop-root": {
                  backdropFilter: "blur(2px)",
                },
                "& > .MuiBox-root": {
                  bgcolor: "black", // Set the background color of the modal content
                  color: "white", // Set the text color if needed
                  boxShadow: "0px 0px 60px 0px rgba(236, 39, 182, 0.60)",
                },
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  bgcolor: "white",
                  padding: "2rem",
                  textAlign: "center",
                }}
              >
                <Typography variant="h5" mb={2}>
                  Successfully deployed your contract!
                </Typography>
                <Typography variant="body2" mb={2}>
                  This is your contract address:
                </Typography>
                <Typography variant="body2" mb={2} fontWeight={600}>
                  {contractAdd}
                </Typography>
                <Button variant="contained">
                  {/* onClick={handleModalClose} */}
                  Next
                </Button>
              </Box>
            </Modal>
            <GradientButton
              icon={<GrDeploy />}
              onClick={deployContract}
              text="Magic Deploy"
              fullWidth
              isDisabled={isDisabled}
              styles={{
                borderRadius: 1,
                height: "2.5rem",
              }}
            />
          </Box>
        </Box>
      </Box>
      <CustomizedDialogs
        steps={[
          "Scaffolding hardhat",
          "Inserting your contract",
          "Running npc hardhat compile",
          "Zipping files",
          "Uploading to lighthouse",
        ]}
        text={"Downloading Hardhat"}
        setOpen={setLoading}
        open={loading}
        stepCount={currentStep}
      />
    </>
  );
}

export default EditorPage;
