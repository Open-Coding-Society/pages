import LogicGate from "LogicGate.js";

class XorGate extends LogicGate
{
    constructor(input1, input2)
    {
        super(input1, input2);
    }

    getOutput()
    {
        return input1.getOutput() ^ input2.getOutput();
    }
}

export default XorGate;