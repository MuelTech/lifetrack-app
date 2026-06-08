# LifeTrack - IPO Model

This document outlines the Input-Process-Output (IPO) model for the LifeTrack application, which can be directly referenced or included in the research paper.

The LifeTrack system architecture operates on a data-driven pipeline where user-reported physical and mental activities are analyzed to provide actionable health insights.

## Structued Breakdown

### 1. INPUT
*The data and information provided by the user into the system.*
* **User Profile Data:** Basic demographics and user configurations such as email, nickname, age, sex, year level, section, and specific health concerns.
* **Daily Lifestyle Logs:** Data submitted by the user on a daily basis reflecting their daily habits:
  * **Sleep Data:** Bedtime, wake-up time, and total sleep hours.
  * **Nutrition Data:** Meal quality (Balanced, Junk, Skipped) for breakfast, lunch, and dinner, along with water intake (in cups).
  * **Physical Activity:** Activity duration (in minutes) and type of activity (Walk, Gym, Sports, None).
  * **Productivity & Screen Time:** Study hours and recreational screen time hours.
  * **Emotional Health:** Self-reported stress levels (Low, Moderate, High).
* **System Inputs:** API requests from the mobile app to the Node.js/Prisma backend.

### 2. PROCESS
*The internal operations, calculations, and logic the system performs using the inputs.*
* **Data Aggregation:** Receiving and compiling daily logs via the Node.js backend to store in the PostgreSQL database.
* **Pattern Detection Engine:** Evaluating the submitted daily logs against predefined health thresholds and rules.
* **Status Categorization:** Classifying the logs into a defined `LifestyleStatus` (e.g., *Balanced*, *Needs Improvement*, or *Unhealthy Pattern Detected*).
* **Streak Calculation:** Automatically updating the user's consecutive logging streak to encourage consistency and retention.
* **Content Matching:** Querying the database to match detected unhealthy habits with targeted educational health guidance articles.

### 3. OUTPUT
*The final results, visualizations, and feedback presented to the user on the mobile interface.*
* **Health Analytics & Insights:** Visual dashboards summarizing the user's lifestyle habits and tracked metrics over time.
* **Pattern Results:** A generated daily assessment highlighting active patterns the user falls under based on that day's log.
* **Personalized Guidance:** Recommended articles and educational content specifically targeted at the user's identified health weaknesses or early signs.
* **Push Notifications:** System-generated alerts to remind users to log their daily habits or to notify them of streak updates.

---

## Diagram

Below is the Flowchart representation of the IPO Model. You can render this using any Markdown viewer that supports Mermaid, or export it as an image using [Mermaid Live Editor](https://mermaid.live).

```mermaid
flowchart TD
    %% Define Styles
    classDef inputBox fill:#e3f2fd,stroke:#1565c0,stroke-width:2px,color:#0d47a1
    classDef processBox fill:#fff3e0,stroke:#e65100,stroke-width:2px,color:#e65100
    classDef outputBox fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px,color:#1b5e20
    classDef header fill:#333,stroke:#333,stroke-width:2px,color:#fff,font-weight:bold

    %% Column Headers (Invisible links to align them)
    I_Header[INPUT] ::: header
    P_Header[PROCESS] ::: header
    O_Header[OUTPUT] ::: header

    %% Inputs
    subgraph INPUTS [ ]
        direction TB
        I1("<b>User Profile Data</b><br/>Demographics, Age, Sex,<br/>Health Concerns") ::: inputBox
        I2("<b>Daily Lifestyle Logs</b><br/>Sleep time/hours, Meal quality,<br/>Activity duration/type") ::: inputBox
        I3("<b>Psychological & Academic Data</b><br/>Stress levels, Screen time,<br/>Study hours") ::: inputBox
    end

    %% Processes
    subgraph PROCESSES [ ]
        direction TB
        P1("<b>Data Aggregation</b><br/>Receive & compile daily logs<br/>via Node.js backend") ::: processBox
        P2("<b>Pattern Detection Engine</b><br/>Analyze inputs against health<br/>thresholds & rules") ::: processBox
        P3("<b>Logic & Calculation</b><br/>Calculate streaks & classify<br/>Lifestyle Status") ::: processBox
        P4("<b>Content Matching</b><br/>Query Prisma to match habits<br/>with relevant articles") ::: processBox
    end

    %% Outputs
    subgraph OUTPUTS [ ]
        direction TB
        O1("<b>Health Analytics & Insights</b><br/>Visual dashboards & daily<br/>progress summaries") ::: outputBox
        O2("<b>Pattern Results</b><br/>Lifestyle Status evaluation<br/>& active habits alerts") ::: outputBox
        O3("<b>Personalized Guidance</b><br/>Targeted educational articles<br/>based on detected patterns") ::: outputBox
        O4("<b>Push Notifications</b><br/>Logging reminders &<br/>streak updates") ::: outputBox
    end

    %% Links
    I_Header ~~~ INPUTS
    P_Header ~~~ PROCESSES
    O_Header ~~~ OUTPUTS

    INPUTS -->|Submitted via App| PROCESSES
    PROCESSES -->|Rendered to UI| OUTPUTS

    %% Style the invisible subgraphs to just act as containers
    style INPUTS fill:none,stroke:none
    style PROCESSES fill:none,stroke:none
    style OUTPUTS fill:none,stroke:none
```
