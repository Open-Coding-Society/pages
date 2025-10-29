import java.util.Scanner;

public class AIQuiz {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int score = 0;
        int totalQuestions = 3;

        System.out.println("Welcome to the AI Types Quiz!");
        System.out.println("Identify which type of AI (Narrow, General, or Super) is described in each example.\n");

        // Question 1
        System.out.println("1. An AI system that can play chess at a grandmaster level but cannot");
        System.out.println("   do anything else, like recognize images or write emails.");
        System.out.println("1) Super AI");
        System.out.println("2) General AI");
        System.out.println("3) Narrow AI");
        
        int answer = getValidInput(scanner);
        if (answer == 3) {
            System.out.println("Correct! This is Narrow AI - it excels at one specific task but cannot perform others.");
            score++;
        } else {
            System.out.println("Incorrect. This is Narrow AI because it can only perform one specific task well.");
        }
        System.out.println();

        // Question 2
        System.out.println("2. An AI system that can learn any new skill just like a human,");
        System.out.println("   understand emotions, and apply knowledge from one field to another.");
        System.out.println("1) Narrow AI");
        System.out.println("2) General AI");
        System.out.println("3) Super AI");
        
        answer = getValidInput(scanner);
        if (answer == 2) {
            System.out.println("Correct! This is General AI - it can learn and adapt like humans across different domains.");
            score++;
        } else {
            System.out.println("Incorrect. This is General AI because it can learn and understand like humans do.");
        }
        System.out.println();

        // Question 3
        System.out.println("3. An AI system that can solve complex global problems instantly,");
        System.out.println("   invent new technologies, and is more intelligent than all human minds combined.");
        System.out.println("1) Super AI");
        System.out.println("2) General AI");
        System.out.println("3) Narrow AI");
        
        answer = getValidInput(scanner);
        if (answer == 1) {
            System.out.println("Correct! This is Super AI - it surpasses human intelligence in every way.");
            score++;
        } else {
            System.out.println("Incorrect. This is Super AI as it exceeds human intelligence and capabilities.");
        }
        System.out.println();

        // Final Score
        System.out.println("Quiz completed!");
        System.out.println("Your score: " + score + " out of " + totalQuestions);
        double percentage = (double) score / totalQuestions * 100;
        System.out.println("Percentage: " + percentage + "%");

        scanner.close();
    }

    // Helper method to get valid input (1-4)
    private static int getValidInput(Scanner scanner) {
        int input;
        while (true) {
            System.out.print("Your answer (1-3): ");
            try {
                input = scanner.nextInt();
                if (input >= 1 && input <= 3) {
                    return input;
                } else {
                    System.out.println("Please enter a number between 1 and 3.");
                }
            } catch (Exception e) {
                System.out.println("Please enter a valid number.");
                scanner.nextLine(); // Clear the invalid input
            }
        }
    }
}