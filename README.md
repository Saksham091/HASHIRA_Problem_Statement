# Shamir's Secret Sharing (HASHIRA Task)

This project was built as part of a problem statement provided by **HASHIRA**.

The task involves reconstructing a secret from multiple encoded shares using a simplified version of **Shamir's Secret Sharing**. Some shares may be incorrect, and the goal is to extract the correct secret and identify faulty shares.

## What It Does

- Reads input from given JSON files
- Decodes values encoded in different bases or small math functions (`sum`, `multiply`, `gcd`, `lcm`)
- Uses interpolation to reconstruct the constant term (`c`) of the hidden polynomial
- Detects and ignores faulty keys
- Outputs the correct secret

## How to Run

1. Make sure `test1.json` and `test2.json` are in the same folder as `solve.js`
2. Run the script:

```bash
node solve.js
