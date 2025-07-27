// //SPDX-License-Identifier: MIT
// pragma solidity 0.8.19;

// import {Script} from "forge-std/Script.sol";
// import {Raffle} from "../src/Raffle.sol";
// import {HelperConfig} from "./HelperConfig.s.sol";
// import {CreateSubscription, AddConsumer, FundSubscription} from "./Interactions.s.sol";

// contract DeployRaffle is Script {
//     function run() public {}

//     function deployContract() public returns (Raffle, HelperConfig) {
//         HelperConfig helperConfig = new HelperConfig();
//         HelperConfig.NetworkConfig memory config = helperConfig.getConfig();
//         // local -> deploy mocks, get local config
//         // sepolia -> get sepolia config

//         if (config.subscriptionId == 0) {
//             //create a subscription
//             CreateSubscription createSubscription = new CreateSubscription();
//             (config.subscriptionId, config.vrfCoordinator) = createSubscription
//                 .createSubscription(config.vrfCoordinator);

//             //Fund it!!
//             FundSubscription fundSubscription = new FundSubscription();
//             fundSubscription.fundSubscription(
//                 config.vrfCoordinator,
//                 config.subscriptionId,
//                 config.link
//             );
//         }

//         vm.startBroadcast();
//         Raffle raffle = new Raffle(
//             config.entranceFee,
//             config.interval,
//             config.vrfCoordinator,
//             config.gasLane,
//             config.subscriptionId,
//             config.callbackGasLimit
//         );

//         vm.stopBroadcast();

//         AddConsumer addConsumer = new AddConsumer();
//         addConsumer.addConsumer(
//             address(raffle),
//             config.vrfCoordinator,
//             config.subscriptionId
//         );

//         return (raffle, helperConfig);
//     }
// }


pragma solidity 0.8.19;

import "forge-std/Script.sol";
import "../src/Raffle.sol";

contract DeployRaffleScript is Script {
    function run() external {
        // Replace these with your actual values
        uint256 entranceFee = 0.01 ether;
        uint256 interval = 60; // 1 min
        address vrfCoordinator = 0x9DdfaCa8183c41ad55329BdeeD9F6A8d53168B1B;
        bytes32 gasLane = 0x787d74caea10b2b357790d5b5247c2f63d1d91572a9846f780606e4d953677ae;
        uint256 subscriptionId = 81787179558202384890027558149273280504726303683096142177333900020626327861384;
        uint32 callbackGasLimit = 500000;

        vm.startBroadcast();
        Raffle raffle = new Raffle(
            entranceFee,
            interval,
            vrfCoordinator,
            gasLane,
            subscriptionId,
            callbackGasLimit
        );
        vm.stopBroadcast();
    }
}

