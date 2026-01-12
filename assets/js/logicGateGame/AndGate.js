import LogicGate from "LogicGate.js";

class AndGate extends LogicGate
{
    constructor(input1, input2)
    {
        super(input1, input2);
    }

    getOutput()
    {
        return this.input1.getOutput() & this.input2.getOutput();
    }
}

export default AndGate;