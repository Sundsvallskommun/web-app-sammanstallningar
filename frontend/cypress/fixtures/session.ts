export const sessionWithoutOutput = {
  data: {
    id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    input: {
      arendenummer: [],
      uppdrag: [],
      bakgrundsmaterial: [],
    },
    stepExecutions: {
      step1: {
        state: 'CREATED',
      },
      step2: {
        state: 'CREATED',
      },
      step3: {
        state: 'CREATED',
      },
    },
    state: 'CREATED',
  },
  message: 'success',
};

export const sessionWithOutput = {
  data: {
    id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    input: {
      arendenummer: [],
      uppdrag: [],
      bakgrundsmaterial: [],
    },
    stepExecutions: {
      step1: {
        state: 'DONE',
        startedAt: '2025-03-24T16:40:00.000000000',
        lastUpdatedAt: '2025-03-24T16:40:10.000000000',
        finishedAt: '2025-03-24T16:40:10.000000000',
        output: 'Resultat av steg 1',
      },
      step2: {
        state: 'DONE',
        startedAt: '2025-03-24T16:40:11.000000000',
        lastUpdatedAt: '2025-03-24T16:40:20.000000000',
        finishedAt: '2025-03-24T16:40:20.000000000',
        output: 'Resultat av steg 2',
      },
      step3: {
        state: 'DONE',
        startedAt: '2025-03-24T16:40:21.000000000',
        lastUpdatedAt: '2025-03-24T16:40:30.000000000',
        finishedAt: '2025-03-24T16:40:30.000000000',
        output: 'Resultat av steg 3',
      },
    },
    state: 'CREATED',
  },
  message: 'success',
};

export const inputValue = {
  value: 'Text input',
};

export const stepExecution1 = {
  data: {
    state: 'DONE',
    startedAt: '2025-03-24T16:40:00.000000000',
    lastUpdatedAt: '2025-03-24T16:40:10.000000000',
    finishedAt: '2025-03-24T16:40:10.000000000',
    output: 'Resultat av steg 1',
  },
  message: 'success',
};

export const stepExecution2 = {
  data: {
    state: 'DONE',
    startedAt: '2025-03-24T16:40:11.000000000',
    lastUpdatedAt: '2025-03-24T16:40:20.000000000',
    finishedAt: '2025-03-24T16:40:20.000000000',
    output: 'Resultat av steg 2',
  },
  message: 'success',
};

export const stepExecution3 = {
  data: {
    state: 'DONE',
    startedAt: '2025-03-24T16:40:21.000000000',
    lastUpdatedAt: '2025-03-24T16:40:30.000000000',
    finishedAt: '2025-03-24T16:40:30.000000000',
    output: 'Resultat av steg 3',
  },
  message: 'success',
};

export const sessionWithStaleDependenciesAfterStep1Rerun = {
  data: {
    id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    input: {
      arendenummer: [],
      uppdrag: [],
      bakgrundsmaterial: [],
    },
    stepExecutions: {
      step1: {
        state: 'DONE',
        startedAt: '2025-03-24T16:41:00.000000000',
        lastUpdatedAt: '2025-03-24T16:41:10.000000000',
        finishedAt: '2025-03-24T16:41:10.000000000',
        output: 'Uppdaterat resultat av steg 1',
      },
      step2: {
        state: 'DONE',
        startedAt: '2025-03-24T16:40:11.000000000',
        lastUpdatedAt: '2025-03-24T16:40:20.000000000',
        finishedAt: '2025-03-24T16:40:20.000000000',
        output: 'Resultat av steg 2',
      },
      step3: {
        state: 'DONE',
        startedAt: '2025-03-24T16:40:21.000000000',
        lastUpdatedAt: '2025-03-24T16:40:30.000000000',
        finishedAt: '2025-03-24T16:40:30.000000000',
        output: 'Resultat av steg 3',
      },
    },
    state: 'CREATED',
  },
  message: 'success',
};

export const sessionWithStaleDependencyAfterStep2Rerun = {
  data: {
    id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    input: {
      arendenummer: [],
      uppdrag: [],
      bakgrundsmaterial: [],
    },
    stepExecutions: {
      step1: {
        state: 'DONE',
        startedAt: '2025-03-24T16:41:00.000000000',
        lastUpdatedAt: '2025-03-24T16:41:10.000000000',
        finishedAt: '2025-03-24T16:41:10.000000000',
        output: 'Uppdaterat resultat av steg 1',
      },
      step2: {
        state: 'DONE',
        startedAt: '2025-03-24T16:42:00.000000000',
        lastUpdatedAt: '2025-03-24T16:42:10.000000000',
        finishedAt: '2025-03-24T16:42:10.000000000',
        output: 'Uppdaterat resultat av steg 2',
      },
      step3: {
        state: 'DONE',
        startedAt: '2025-03-24T16:40:21.000000000',
        lastUpdatedAt: '2025-03-24T16:40:30.000000000',
        finishedAt: '2025-03-24T16:40:30.000000000',
        output: 'Resultat av steg 3',
      },
    },
    state: 'CREATED',
  },
  message: 'success',
};

export const sessionWithoutStaleDependenciesAfterStep3Rerun = {
  data: {
    id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    input: {
      arendenummer: [],
      uppdrag: [],
      bakgrundsmaterial: [],
    },
    stepExecutions: {
      step1: {
        state: 'DONE',
        startedAt: '2025-03-24T16:41:00.000000000',
        lastUpdatedAt: '2025-03-24T16:41:10.000000000',
        finishedAt: '2025-03-24T16:41:10.000000000',
        output: 'Uppdaterat resultat av steg 1',
      },
      step2: {
        state: 'DONE',
        startedAt: '2025-03-24T16:42:00.000000000',
        lastUpdatedAt: '2025-03-24T16:42:10.000000000',
        finishedAt: '2025-03-24T16:42:10.000000000',
        output: 'Uppdaterat resultat av steg 2',
      },
      step3: {
        state: 'DONE',
        startedAt: '2025-03-24T16:43:00.000000000',
        lastUpdatedAt: '2025-03-24T16:43:10.000000000',
        finishedAt: '2025-03-24T16:43:10.000000000',
        output: 'Uppdaterat resultat av steg 3',
      },
    },
    state: 'CREATED',
  },
  message: 'success',
};

export const stepExecution1Rerun = {
  data: {
    state: 'DONE',
    startedAt: '2025-03-24T16:41:00.000000000',
    lastUpdatedAt: '2025-03-24T16:41:10.000000000',
    finishedAt: '2025-03-24T16:41:10.000000000',
    output: 'Uppdaterat resultat av steg 1',
  },
  message: 'success',
};

export const stepExecution2Rerun = {
  data: {
    state: 'DONE',
    startedAt: '2025-03-24T16:42:00.000000000',
    lastUpdatedAt: '2025-03-24T16:42:10.000000000',
    finishedAt: '2025-03-24T16:42:10.000000000',
    output: 'Uppdaterat resultat av steg 2',
  },
  message: 'success',
};

export const stepExecution3Rerun = {
  data: {
    state: 'DONE',
    startedAt: '2025-03-24T16:43:00.000000000',
    lastUpdatedAt: '2025-03-24T16:43:10.000000000',
    finishedAt: '2025-03-24T16:43:10.000000000',
    output: 'Uppdaterat resultat av steg 3',
  },
  message: 'success',
};

export const deleteSessionResponse = {
  data: {
    status: 200,
  },
  message: 'success',
};
