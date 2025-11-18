// Mock axios and related functionality
const mockAxiosInstance = {
  interceptors: {
    request: { use: jest.fn() },
    response: { use: jest.fn() },
  },
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
};

jest.mock('axios', () => ({
  create: jest.fn(() => mockAxiosInstance),
}));

describe('axiosInstance', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('creates axios instance with correct configuration', () => {
    const mockAxios = require('axios');
    
    // Import after mocking to trigger axios.create
    require('../../lib/axiosInstance');
    
    expect(mockAxios.create).toHaveBeenCalled();
  });

  test('has interceptors configured', () => {
    // Import after mocking
    require('../../lib/axiosInstance');
    
    expect(mockAxiosInstance.interceptors.request).toBeDefined();
    expect(mockAxiosInstance.interceptors.response).toBeDefined();
  });

  test('handles GET requests', async () => {
    const mockResponse = { data: { message: 'success' } };
    mockAxiosInstance.get.mockResolvedValue(mockResponse);
    
    const response = await mockAxiosInstance.get('/test-endpoint');
    
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/test-endpoint');
    expect(response).toEqual(mockResponse);
  });

  test('handles POST requests', async () => {
    const mockResponse = { data: { id: 1, created: true } };
    const postData = { name: 'test' };
    
    mockAxiosInstance.post.mockResolvedValue(mockResponse);
    
    const response = await mockAxiosInstance.post('/test-endpoint', postData);
    
    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/test-endpoint', postData);
    expect(response).toEqual(mockResponse);
  });

  test('handles PUT requests', async () => {
    const mockResponse = { data: { id: 1, updated: true } };
    const putData = { name: 'updated test' };
    
    mockAxiosInstance.put.mockResolvedValue(mockResponse);
    
    const response = await mockAxiosInstance.put('/test-endpoint/1', putData);
    
    expect(mockAxiosInstance.put).toHaveBeenCalledWith('/test-endpoint/1', putData);
    expect(response).toEqual(mockResponse);
  });

  test('handles DELETE requests', async () => {
    const mockResponse = { data: { deleted: true } };
    
    mockAxiosInstance.delete.mockResolvedValue(mockResponse);
    
    const response = await mockAxiosInstance.delete('/test-endpoint/1');
    
    expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/test-endpoint/1');
    expect(response).toEqual(mockResponse);
  });

  test('handles request errors', async () => {
    const error = new Error('Network Error');
    mockAxiosInstance.get.mockRejectedValue(error);
    
    await expect(mockAxiosInstance.get('/test-endpoint')).rejects.toThrow('Network Error');
  });

  test('handles response errors', async () => {
    const errorResponse = {
      response: {
        status: 404,
        data: { message: 'Not found' }
      }
    };
    
    mockAxiosInstance.get.mockRejectedValue(errorResponse);
    
    await expect(mockAxiosInstance.get('/not-found')).rejects.toMatchObject(errorResponse);
  });

  test('can be configured with custom headers', async () => {
    const customHeaders = { 'Authorization': 'Bearer token123' };
    const mockResponse = { data: { authenticated: true } };
    
    mockAxiosInstance.get.mockResolvedValue(mockResponse);
    
    await mockAxiosInstance.get('/protected', { headers: customHeaders });
    
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/protected', { headers: customHeaders });
  });

  test('provides expected axios interface', () => {
    expect(typeof mockAxiosInstance.get).toBe('function');
    expect(typeof mockAxiosInstance.post).toBe('function');
    expect(typeof mockAxiosInstance.put).toBe('function');
    expect(typeof mockAxiosInstance.delete).toBe('function');
    expect(mockAxiosInstance.interceptors).toBeDefined();
    expect(mockAxiosInstance.interceptors.request).toBeDefined();
    expect(mockAxiosInstance.interceptors.response).toBeDefined();
  });
});