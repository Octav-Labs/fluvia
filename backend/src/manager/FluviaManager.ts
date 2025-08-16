import { Request, Response } from 'express';
import { FluviaFactory, mapRecordToFluvia } from '../factories/FluviaFactory';
import { UserFactory } from '../factories/UserFactory';
import { PrivyService } from '../service/PrivyService';
import { ChainId, ChainInfo, chains, CURRENT_CHAIN_ID } from '../chain';

export class FluviaManager {
  private fluviaFactory: FluviaFactory;
  private privyService: PrivyService;
  private userFactory: UserFactory;
  private chain?: ChainInfo;

  constructor() {
    this.fluviaFactory = new FluviaFactory();
    this.userFactory = new UserFactory();
    this.chain = chains[CURRENT_CHAIN_ID] ?? chains[ChainId.BASE_SEPOLIA]!; // Provide default chain
    this.privyService = new PrivyService();
  }

  /**
   * Create a new Fluvia for the authenticated user
   */
  async createFluvia(req: Request, res: Response) {
    try {
      const { user: userPrivy } = req;
      const { userId } = req.user!;
      const { label, recipientAddress, walletId, address } = req.body;

      // Get the user from database
      const user = await this.userFactory.findByPrivyUserId(userId);
      if (!user || !userPrivy) {
        return res.status(404).json({
          error: 'User not found',
          message: 'User does not exist in database',
        });
      }
      console.log(this.chain, 'chain');

      // Privy deployment
      const contractAddress = await this.privyService.deployFluvia(
        walletId,
        this.chain!.chainId,
        6,
        recipientAddress
      );

      // // Create new Fluvia
      // const fluviaRecord = await this.fluviaFactory.create({
      //   user_uuid: user.uuid,
      //   contract_address: contractAddress,
      //   label: label,
      //   receiver_address: receiverAddress,
      // });

      // const fluvia = mapRecordToFluvia(fluviaRecord);

      return res.status(201).json({
        message: 'Fluvia created successfully',
        fluvia: [],
      });
    } catch (error) {
      console.error('Error creating Fluvia:', error);
      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to create Fluvia',
      });
    }
  }

  /**
   * Get all Fluvia for the authenticated user
   */
  async getAllFluviaByUser(req: Request, res: Response) {
    try {
      const { userId } = req.user!;

      // Get the user from database
      const user = await this.userFactory.findByPrivyUserId(userId);
      if (!user) {
        return res.status(404).json({
          error: 'User not found',
          message: 'User does not exist in database',
        });
      }

      // Get all Fluvia for this user
      const fluvias = await this.fluviaFactory.findByUserUuid(user.uuid);

      return res.json({
        fluvias: fluvias,
        count: fluvias.length,
      });
    } catch (error) {
      console.error('Error getting Fluvia:', error);
      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to get Fluvia',
      });
    }
  }

  /**
   * Get a specific Fluvia by UUID (if it belongs to the user)
   */
  async getFluviaById(req: Request, res: Response) {
    try {
      const { userId } = req.user!;
      const { uuid } = req.params;

      if (!uuid) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'UUID is required',
        });
      }

      // Get the user from database
      const user = await this.userFactory.findByPrivyUserId(userId);
      if (!user) {
        return res.status(404).json({
          error: 'User not found',
          message: 'User does not exist in database',
        });
      }

      // Get the Fluvia
      const fluviaRecord = await this.fluviaFactory.findById(uuid);
      if (!fluviaRecord) {
        return res.status(404).json({
          error: 'Fluvia not found',
          message: 'Fluvia does not exist',
        });
      }

      const fluvia = mapRecordToFluvia(fluviaRecord);

      // Check if the Fluvia belongs to the user
      if (fluvia.userUuid !== user.uuid) {
        return res.status(403).json({
          error: 'Forbidden',
          message: 'You do not have permission to access this Fluvia',
        });
      }

      return res.json({
        fluvia: fluvia,
      });
    } catch (error) {
      console.error('Error getting Fluvia:', error);
      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to get Fluvia',
      });
    }
  }

  /**
   * Update a Fluvia (if it belongs to the user)
   */
  async updateFluvia(req: Request, res: Response) {
    try {
      const { userId } = req.user!;
      const { uuid } = req.params;
      const updateData = req.body;

      if (!uuid) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'UUID is required',
        });
      }

      // Get the user from database
      const user = await this.userFactory.findByPrivyUserId(userId);
      if (!user) {
        return res.status(404).json({
          error: 'User not found',
          message: 'User does not exist in database',
        });
      }

      // Get the Fluvia
      const existingFluviaRecord = await this.fluviaFactory.findById(uuid);
      if (!existingFluviaRecord) {
        return res.status(404).json({
          error: 'Fluvia not found',
          message: 'Fluvia does not exist',
        });
      }

      const existingFluvia = mapRecordToFluvia(existingFluviaRecord);

      // Check if the Fluvia belongs to the user
      if (existingFluvia.userUuid !== user.uuid) {
        return res.status(403).json({
          error: 'Forbidden',
          message: 'You do not have permission to update this Fluvia',
        });
      }

      // Remove sensitive fields that shouldn't be updated
      delete updateData.uuid;
      delete updateData.userUuid;
      delete updateData.user_uuid;

      // Update the Fluvia
      const [updatedCount, updatedRecords] = await this.fluviaFactory.update(
        { uuid: uuid },
        updateData
      );

      if (updatedCount === 0 || !updatedRecords[0]) {
        return res.status(404).json({
          error: 'Fluvia not found',
          message: 'Fluvia does not exist',
        });
      }

      const updatedFluvia = mapRecordToFluvia(updatedRecords[0]);

      return res.json({
        message: 'Fluvia updated successfully',
        fluvia: updatedFluvia,
      });
    } catch (error) {
      console.error('Error updating Fluvia:', error);
      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to update Fluvia',
      });
    }
  }

  /**
   * Delete a Fluvia (if it belongs to the user)
   */
  async deleteFluvia(req: Request, res: Response) {
    try {
      const { userId } = req.user!;
      const { uuid } = req.params;

      if (!uuid) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'UUID is required',
        });
      }

      // Get the user from database
      const user = await this.userFactory.findByPrivyUserId(userId);
      if (!user) {
        return res.status(404).json({
          error: 'User not found',
          message: 'User does not exist in database',
        });
      }

      // Get the Fluvia
      const existingFluviaRecord = await this.fluviaFactory.findById(uuid);
      if (!existingFluviaRecord) {
        return res.status(404).json({
          error: 'Fluvia not found',
          message: 'Fluvia does not exist',
        });
      }

      const existingFluvia = mapRecordToFluvia(existingFluviaRecord);

      // Check if the Fluvia belongs to the user
      if (existingFluvia.userUuid !== user.uuid) {
        return res.status(403).json({
          error: 'Forbidden',
          message: 'You do not have permission to delete this Fluvia',
        });
      }

      // Delete the Fluvia
      const deletedCount = await this.fluviaFactory.deleteById(uuid);

      if (deletedCount === 0) {
        return res.status(404).json({
          error: 'Fluvia not found',
          message: 'Fluvia does not exist',
        });
      }

      return res.json({
        message: 'Fluvia deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting Fluvia:', error);
      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to delete Fluvia',
      });
    }
  }
}
