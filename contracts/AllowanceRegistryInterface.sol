pragma solidity 0.4.23;


contract AllowanceRegistryInterface {
    function transferAllowed(address _from, address _to, uint256 _value) public view returns(bool _isAllowed);
}
