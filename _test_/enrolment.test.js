const {
  getEnrollmentsByStudent,
  getEnrollmentsByCourse
} = require('../controllers/enrollmentController');
const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');

// Mock the database connection module
jest.mock('../data/database', () => ({
  getDb: jest.fn()
}));

describe('Enrollment Controller - Unit Tests', () => {
  let req, res;
  let mockFind;

  beforeEach(() => {
    // Reset mocks and create new request/response objects for each test
    jest.clearAllMocks();
    req = { params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      setHeader: jest.fn()
    };
    
    // Create fresh mocks for the nested database calls in each test run
    mockFind = jest.fn();
    const mockCollection = { find: mockFind };
    const mockDb = { collection: jest.fn().mockReturnValue(mockCollection) };
    const mockClient = { db: jest.fn().mockReturnValue(mockDb) };
    
    // Set up the mock chain on the mocked module
    mongodb.getDb.mockReturnValue(mockClient);
  });

  describe('getEnrollmentsByStudent', () => {
    it('should return enrollments for a student if found', async () => {
      const studentId = new ObjectId();
      req.params.id = studentId.toString();

      const mockEnrollments = [
        { _id: new ObjectId(), studentId, courseId: new ObjectId(), progress: 'in-progress' },
        { _id: new ObjectId(), studentId, courseId: new ObjectId(), progress: 'completed' }
      ];
      
      // Configure the mock find() to return a cursor with a resolved toArray()
      mockFind.mockReturnValue({
        toArray: jest.fn().mockResolvedValue(mockEnrollments)
      });


      await getEnrollmentsByStudent(req, res);
      
      expect(mockFind).toHaveBeenCalledWith({ studentId: new ObjectId(req.params.id) });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockEnrollments);
    });

    it('should return an empty array if no enrollments for the student are found', async () => {
      const studentId = new ObjectId();
      req.params.id = studentId.toString();
      
      // Configure the mock find() to return a cursor with an empty array
      mockFind.mockReturnValue({
        toArray: jest.fn().mockResolvedValue([])
      });

      await getEnrollmentsByStudent(req, res);
      
      expect(mockFind).toHaveBeenCalledWith({ studentId: new ObjectId(req.params.id) });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([]);
    });


        it('should return an empty array if no enrollments for the student are found', async () => {
      const studentId = new ObjectId();
      req.params.id = studentId.toString();

      // Configure the mock find() to return a cursor with an empty array
      mockFind.mockReturnValue({
        toArray: jest.fn().mockResolvedValue([])
      });

      await getEnrollmentsByStudent(req, res);

      expect(mockFind).toHaveBeenCalledWith({ studentId: new ObjectId(req.params.id) });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([]);
    });

    it('should handle database errors', async () => {
      const studentId = new ObjectId();
      req.params.id = studentId.toString();

      // Configure the mock find() to return a cursor with a rejected promise
      const errorMessage = 'Database connection failed';
      mockFind.mockReturnValue({
        toArray: jest.fn().mockRejectedValue(new Error(errorMessage))
      });

      await getEnrollmentsByStudent(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch enrollments', details: errorMessage });
    });
  });
  
  describe('getEnrollmentsByCourse', () => {
    it('should return enrollments for a course if found', async () => {
      const courseId = new ObjectId();
      req.params.id = courseId.toString();

      const mockEnrollments = [
        { _id: new ObjectId(), studentId: new ObjectId(), courseId, progress: 'enrolled' },
        { _id: new ObjectId(), studentId: new ObjectId(), courseId, progress: 'completed' }
      ];

      // Configure the mock find() to return a cursor with a resolved toArray()
      mockFind.mockReturnValue({
        toArray: jest.fn().mockResolvedValue(mockEnrollments)
      });

      await getEnrollmentsByCourse(req, res);

      expect(mockFind).toHaveBeenCalledWith({ courseId: new ObjectId(req.params.id) });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockEnrollments);
    });

    it('should return an empty array if no enrollments for the course are found', async () => {
      const courseId = new ObjectId();
      req.params.id = courseId.toString();

      // Configure the mock find() to return a cursor with an empty array
      mockFind.mockReturnValue({
        toArray: jest.fn().mockResolvedValue([])
      });

      await getEnrollmentsByCourse(req, res);

      expect(mockFind).toHaveBeenCalledWith({ courseId: new ObjectId(req.params.id) });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([]);
    });

    it('should handle database errors', async () => {
      const courseId = new ObjectId();
      req.params.id = courseId.toString();

      // Configure the mock find() to return a cursor with a rejected promise
      const errorMessage = 'Database connection failed';
      mockFind.mockReturnValue({
        toArray: jest.fn().mockRejectedValue(new Error(errorMessage))
      });

      await getEnrollmentsByCourse(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch enrollments', details: errorMessage });
    });
  });
});