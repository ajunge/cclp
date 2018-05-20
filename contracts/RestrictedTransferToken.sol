pragma solidity 0.4.23;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/StandardToken.sol";

import "./AllowanceRegistryInterface.sol";


contract RestrictedTransferToken is Ownable, StandardToken {

    AllowanceRegistryInterface public registry;
  
    modifier isTransferAllowed(address _from, address _to, uint256 _value) {
        require(registry.transferAllowed(_from, _to, _value));
        _;
    }

    constructor(AllowanceRegistryInterface _registry) public {
        require(_registry != address(0));
        registry = _registry; 
    }

    function transfer(address _to, uint256 _value)
        public 
        isTransferAllowed(msg.sender, _to, _value) 
        returns (bool success) 
    {
        return super.transfer(_to, _value);
    }

    function transferFrom(address _from, address _to, uint256 _value)
        public 
        isTransferAllowed(_from, _to, _value)
        returns (bool success) 
    {
        return super.transferFrom(_from, _to, _value);
    }

    function changeRegistry(AllowanceRegistryInterface _newRegistry) public onlyOwner {
        require(_newRegistry != address(0));
        registry = _newRegistry; 
    }
}
